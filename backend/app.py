import os
import uuid
import asyncio
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import replicate
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip, CompositeAudioClip
import requests
import tempfile
from PIL import Image, ImageDraw, ImageFont
import logging
from werkzeug.utils import secure_filename
import threading
import time
import numpy as np

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])  # Allow React frontend on both common ports

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'public/videos'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Initialize Replicate
replicate.api_token = os.getenv('REPLICATE_API_TOKEN')

# Global dictionary to track processing status
processing_status = {}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(extension):
    """Generate a unique filename with given extension"""
    return f"{uuid.uuid4().hex}.{extension}"

def create_text_overlay_with_pil(text, video_width, video_height, duration):
    """Create text overlay using PIL instead of ImageMagick"""
    try:
        # Create a transparent image for overlay
        overlay_height = int(video_height * 0.15)  # 15% of video height for text area
        img = Image.new('RGBA', (video_width, overlay_height), (0, 0, 0, 128))  # Semi-transparent black
        draw = ImageDraw.Draw(img)
        
        # Try to use a better font, fallback to default
        try:
            font_size = int(video_height * 0.04)  # 4% of video height
            # Try common system fonts
            for font_name in ['Arial.ttf', 'arial.ttf', 'Helvetica.ttc', 'DejaVuSans.ttf']:
                try:
                    font = ImageFont.truetype(font_name, font_size)
                    break
                except:
                    continue
            else:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        # Word wrap text
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] <= video_width * 0.9:  # 90% of video width
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        # Limit to 3 lines
        lines = lines[:3]
        
        # Draw text lines
        y_offset = 10
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            text_width = bbox[2] - bbox[0]
            x = (video_width - text_width) // 2
            
            # Draw text with outline effect
            for adj in range(-2, 3):
                for adj2 in range(-2, 3):
                    if adj != 0 or adj2 != 0:
                        draw.text((x + adj, y_offset + adj2), line, font=font, fill='black')
            
            draw.text((x, y_offset), line, font=font, fill='white')
            y_offset += bbox[3] - bbox[1] + 5
        
        # Convert PIL image to numpy array
        img_array = np.array(img)
        
        # Create ImageClip from numpy array
        from moviepy.editor import ImageClip
        text_clip = ImageClip(img_array, duration=duration).set_position(('center', 'bottom')).set_opacity(0.9)
        
        return text_clip
        
    except Exception as e:
        logger.error(f"Error creating text overlay with PIL: {str(e)}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "VideoScriptify API is running"})

@app.route('/api/generate-script', methods=['POST'])
def generate_script():
    """Generate script from user prompt using GPT-4 via Replicate"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        video_duration = data.get('duration', 30)  # Default 30 seconds
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        # Enhanced prompt for script generation
        enhanced_prompt = f"""
        Create an engaging {video_duration}-second video script based on this topic: "{prompt}"
        
        Requirements:
        - Write exactly {video_duration} seconds worth of content (approximately {video_duration * 3} words)
        - Make it engaging and suitable for video narration
        - Include natural pauses and emphasis
        - Write in a conversational, enthusiastic tone
        - Structure it for easy reading/speaking
        - Focus on key points that would work well with visual content
        
        Format the response as a clean script without any additional text or explanations.
        """
        
        # Use Replicate to generate script with GPT-4
        output = replicate.run(
            "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
            input={
                "prompt": enhanced_prompt,
                "max_tokens": 500,
                "temperature": 0.7
            }
        )
        
        # Properly handle the generator object by collecting all chunks
        script_chunks = []
        try:
            for chunk in output:
                if chunk:
                    script_chunks.append(str(chunk))
        except Exception as e:
            logger.error(f"Error iterating through output: {str(e)}")
            # Fallback: try to convert directly if iteration fails
            script_chunks = [str(output)]
        
        # Join all chunks to form the complete script
        script = ''.join(script_chunks).strip()
        
        # If script is still empty or looks like a generator object, provide a fallback
        if not script or "generator object" in script.lower():
            script = f"""Welcome to this {video_duration}-second guide about {prompt}!

Today we'll explore the key aspects of {prompt} in a clear and engaging way. 

First, let's understand the basics and why this topic matters to you.

Next, we'll dive into practical tips and actionable insights you can use right away.

Finally, we'll wrap up with key takeaways that will help you succeed.

Thank you for watching, and remember to like and subscribe for more content like this!"""
        
        return jsonify({
            "success": True,
            "script": script,
            "duration": video_duration,
            "word_count": len(script.split())
        })
        
    except Exception as e:
        logger.error(f"Script generation error: {str(e)}")
        return jsonify({"error": f"Failed to generate script: {str(e)}"}), 500

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    data = request.get_json()
    text = data.get("script")

    if not text:
        print("❌ No text provided")
        return jsonify({"error": "No text provided"}), 400

    print(f"🔊 Generating audio for text: {text}")

    try:
        output = replicate.run(
            "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
            input={
                "text": text,
                "speed": 1,
                "voice": "af_alloy"
            }
        )

        audio_url = str(output)
        
        # Generate a unique filename for the audio
        audio_filename = generate_unique_filename('mp3')
        audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
        
        # Download the audio file from the URL and save it locally
        try:
            response = requests.get(audio_url)
            response.raise_for_status()
            with open(audio_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Audio saved as: {audio_filename}")
        except Exception as e:
            print(f"❌ Failed to download audio: {str(e)}")
            # If download fails, still return the URL but no filename
            return jsonify({ 
                "audio_url": audio_url,
                "audio_filename": None,
                "error": "Audio generated but couldn't save locally"
            })

        # Return both the URL and filename
        return jsonify({ 
            "audio_url": audio_url,
            "audio_filename": audio_filename
        })

    except Exception as e:
        print("🔥 Error generating audio:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-video', methods=['POST'])
def upload_video():
    """Upload video file for processing"""
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        file = request.files['video']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = generate_unique_filename(filename.rsplit('.', 1)[1].lower())
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            
            # Get video info
            with VideoFileClip(file_path) as video:
                duration = video.duration
                fps = video.fps
                size = video.size
            
            return jsonify({
                "success": True,
                "filename": unique_filename,
                "duration": duration,
                "fps": fps,
                "size": size,
                "file_size": os.path.getsize(file_path)
            })
        
        return jsonify({"error": "Invalid file type"}), 400
        
    except Exception as e:
        logger.error(f"Video upload error: {str(e)}")
        return jsonify({"error": f"Failed to upload video: {str(e)}"}), 500

@app.route('/api/add-overlay', methods=['POST'])
def add_overlay():
    """Add text overlay and audio narration to video"""
    try:
        data = request.json
        video_filename = data.get('video_filename', '')
        script = data.get('script', '')
        audio_filename = data.get('audio_filename', '')
        overlay_text = data.get('overlay_text', script)  # Use script as overlay if not specified
        
        if not video_filename or not script:
            return jsonify({"error": "Video filename and script are required"}), 400
        
        # Generate processing ID
        process_id = str(uuid.uuid4())
        processing_status[process_id] = {"status": "processing", "progress": 0}
        
        # Start processing in background thread
        def process_video():
            try:
                video_path = os.path.join(UPLOAD_FOLDER, video_filename)
                output_filename = generate_unique_filename('mp4')
                output_path = os.path.join(OUTPUT_FOLDER, output_filename)
                
                processing_status[process_id]["progress"] = 20
                
                # Load video
                video = VideoFileClip(video_path)
                processing_status[process_id]["progress"] = 40
                
                # Create text overlay using PIL (no ImageMagick required)
                if overlay_text:
                    try:
                        text_clip = create_text_overlay_with_pil(
                            overlay_text, 
                            video.w, 
                            video.h, 
                            video.duration
                        )
                        if text_clip:
                            video = CompositeVideoClip([video, text_clip])
                            logger.info("Text overlay added successfully using PIL")
                        else:
                            logger.warning("Failed to create text overlay, continuing without overlay")
                    except Exception as e:
                        logger.error(f"Text overlay error: {str(e)}, continuing without overlay")
                
                processing_status[process_id]["progress"] = 60
                
                # Handle audio
                if audio_filename:
                    audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
                    if os.path.exists(audio_path):
                        # Load narration audio
                        narration = AudioFileClip(audio_path)
                        
                        # Reduce original audio volume to 30%
                        if video.audio:
                            original_audio = video.audio.volumex(0.3)
                            # Composite audio tracks
                            final_audio = CompositeAudioClip([original_audio, narration])
                        else:
                            final_audio = narration
                        
                        # Set the audio to the video
                        video = video.set_audio(final_audio)
                
                processing_status[process_id]["progress"] = 80
                
                # Export final video
                video.write_videofile(
                    output_path,
                    codec='libx264',
                    audio_codec='aac',
                    temp_audiofile='temp-audio.m4a',
                    remove_temp=True,
                    verbose=False,
                    logger=None
                )
                
                processing_status[process_id] = {
                    "status": "completed",
                    "progress": 100,
                    "output_filename": output_filename,
                    "download_url": f"/api/download/{output_filename}"
                }
                
                # Cleanup
                video.close()
                if 'narration' in locals():
                    narration.close()
                
            except Exception as e:
                logger.error(f"Video processing error: {str(e)}")
                processing_status[process_id] = {
                    "status": "error",
                    "progress": 0,
                    "error": str(e)
                }
        
        # Start processing thread
        thread = threading.Thread(target=process_video)
        thread.start()
        
        return jsonify({
            "success": True,
            "process_id": process_id,
            "message": "Video processing started"
        })
        
    except Exception as e:
        logger.error(f"Add overlay error: {str(e)}")
        return jsonify({"error": f"Failed to start video processing: {str(e)}"}), 500

@app.route('/api/processing-status/<process_id>', methods=['GET'])
def get_processing_status(process_id):
    """Get the status of video processing"""
    if process_id in processing_status:
        return jsonify(processing_status[process_id])
    else:
        return jsonify({"error": "Process ID not found"}), 404

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download processed file"""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({"error": f"Failed to download file: {str(e)}"}), 500

@app.route('/api/preview/<filename>', methods=['GET'])
def preview_file(filename):
    """Stream file for preview"""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        logger.error(f"Preview error: {str(e)}")
        return jsonify({"error": f"Failed to preview file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 