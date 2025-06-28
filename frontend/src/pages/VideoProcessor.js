import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { 
  Upload, 
  FileText, 
  Volume2, 
  Video, 
  Download,
  Play,
  Pause,
  RotateCcw,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Wand2,
  Settings,
  Clock
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { apiService, fileUtils, handleApiError } from '../utils/api';

const VideoProcessor = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, title: 'Generate Script', icon: FileText },
    { id: 2, title: 'Create Audio', icon: Volume2 },
    { id: 3, title: 'Upload Video', icon: Upload },
    { id: 4, title: 'Process Video', icon: Video },
  ];

  // Script generation state
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(30);
  const [script, setScript] = useState('');
  const [scriptLoading, setScriptLoading] = useState(false);

  // Audio generation state
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioFilename, setAudioFilename] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Video upload state
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Video processing state
  const [processing, setProcessing] = useState(false);
  const [processId, setProcessId] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [finalVideoFilename, setFinalVideoFilename] = useState('');

  // Audio element for playback
  const [audioElement, setAudioElement] = useState(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('play', () => setIsPlaying(true));
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('play', () => setIsPlaying(true));
    };
  }, []);

  // Polling for processing status
  useEffect(() => {
    let interval;
    if (processing && processId) {
      interval = setInterval(async () => {
        try {
          const status = await apiService.getProcessingStatus(processId);
          setProcessingProgress(status.progress || 0);
          
          if (status.status === 'completed') {
            setProcessing(false);
            setFinalVideoUrl(status.download_url);
            setFinalVideoFilename(status.output_filename);
            toast.success('Video processed successfully! 🎉');
            setCurrentStep(5); // Move to final step
          } else if (status.status === 'error') {
            setProcessing(false);
            toast.error(`Processing failed: ${status.error}`);
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processing, processId]);

  // Generate script
  const generateScript = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for script generation');
      return;
    }

    setScriptLoading(true);
    try {
      const response = await apiService.generateScript(prompt, duration);
      setScript(response.script);
      toast.success('Script generated successfully!');
      setCurrentStep(2);
    } catch (error) {
      toast.error(handleApiError(error, 'Failed to generate script'));
    } finally {
      setScriptLoading(false);
    }
  };

  // Generate audio
  const generateAudio = async () => {
    if (!script.trim()) {
      toast.error('Please generate a script first');
      return;
    }

    setAudioLoading(true);
    try {
      const response = await apiService.generateAudio(script);
      setAudioFilename(response.audio_filename);
      setAudioUrl(response.audio_url);
      toast.success('Audio generated successfully!');
      setCurrentStep(3);
    } catch (error) {
      toast.error(handleApiError(error, 'Failed to generate audio'));
    } finally {
      setAudioLoading(false);
    }
  };

  // Play/pause audio
  const toggleAudio = () => {
    if (!audioElement || !audioUrl) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.src = apiService.getPreviewUrl(audioFilename);
      audioElement.play().catch(error => {
        console.error('Audio play error:', error);
        toast.error('Failed to play audio');
      });
    }
  };

  // Handle video drop
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!fileUtils.isValidVideoFile(file)) {
      toast.error('Please upload a valid video file (MP4, MOV, AVI, MKV)');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await apiService.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadedVideo(response);
      toast.success('Video uploaded successfully!');
      setCurrentStep(4);
    } catch (error) {
      toast.error(handleApiError(error, 'Failed to upload video'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1,
    multiple: false
  });

  // Process video
  const processVideo = async () => {
    if (!uploadedVideo || !script || !audioFilename) {
      toast.error('Please complete all previous steps first');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);

    try {
      const response = await apiService.addOverlay(
        uploadedVideo.filename,
        script,
        audioFilename,
        script // Use script as overlay text
      );
      
      setProcessId(response.process_id);
      toast.success('Video processing started!');
    } catch (error) {
      setProcessing(false);
      toast.error(handleApiError(error, 'Failed to start video processing'));
    }
  };

  // Download final video
  const downloadVideo = async () => {
    if (!finalVideoFilename) return;

    try {
      const response = await apiService.downloadFile(finalVideoFilename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-${finalVideoFilename}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Video downloaded successfully!');
    } catch (error) {
      toast.error(handleApiError(error, 'Failed to download video'));
    }
  };

  // Reset workflow
  const resetWorkflow = () => {
    setCurrentStep(1);
    setPrompt('');
    setScript('');
    setAudioFilename('');
    setAudioUrl('');
    setUploadedVideo(null);
    setFinalVideoUrl('');
    setFinalVideoFilename('');
    setProcessId('');
    setProcessingProgress(0);
    setIsPlaying(false);
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Process Your Video
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your video with AI-generated scripts, narration, and text overlays
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className="flex items-center">
                    <div
                      className={`step-indicator ${
                        currentStep > step.id
                          ? 'step-completed'
                          : currentStep === step.id
                          ? 'step-active'
                          : 'step-inactive'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300 ml-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Script Generation */}
          {currentStep === 1 && (
            <motion.div
              key="script"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate AI Script</h2>
                <p className="text-gray-600">
                  Describe your video content and let AI create an engaging script
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Duration (seconds)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Description
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what your video is about. For example: 'A tutorial on how to make coffee, focusing on the grinding technique and brewing methods for beginners'"
                    className="textarea-field"
                    rows={4}
                  />
                </div>

                {script && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Generated Script
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto">
                      {script}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={generateScript}
                    disabled={scriptLoading || !prompt.trim()}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {scriptLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Script
                      </>
                    )}
                  </button>
                  
                  {script && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn-secondary flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Audio Generation */}
          {currentStep === 2 && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <Volume2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate AI Narration</h2>
                <p className="text-gray-600">
                  Convert your script into natural-sounding audio narration
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Script to Narrate
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-32 overflow-y-auto">
                    {script}
                  </div>
                </div>

                {audioUrl && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-900">Audio Preview</span>
                      <button
                        onClick={toggleAudio}
                        className="btn-secondary flex items-center px-3 py-1 text-sm"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Play
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-blue-700">
                      Audio file: {audioFilename}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn-secondary flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  
                  <button
                    onClick={generateAudio}
                    disabled={audioLoading || !script.trim()}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {audioLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Audio...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Generate Audio
                      </>
                    )}
                  </button>
                  
                  {audioUrl && (
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-secondary flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Video Upload */}
          {currentStep === 3 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Video</h2>
                <p className="text-gray-600">
                  Choose the video file you want to enhance with script and narration
                </p>
              </div>

              <div className="space-y-6">
                {!uploadedVideo ? (
                  <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${
                      isDragReject ? 'dropzone-reject' : ''
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    
                    {uploading ? (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <CircularProgressbar
                            value={uploadProgress}
                            text={`${uploadProgress}%`}
                            styles={buildStyles({
                              textSize: '20px',
                              pathColor: '#3B82F6',
                              textColor: '#3B82F6',
                            })}
                          />
                        </div>
                        <p className="text-blue-600 font-medium">Uploading video...</p>
                      </div>
                    ) : isDragActive ? (
                      <p className="text-blue-600 font-medium">Drop your video here...</p>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-2">
                          Drag and drop your video file here, or click to browse
                        </p>
                        <p className="text-sm text-gray-400">
                          Supports MP4, MOV, AVI, MKV (max 100MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-green-900">Video Uploaded Successfully</h3>
                        <div className="text-sm text-green-700 mt-1">
                          <p>Duration: {fileUtils.formatDuration(uploadedVideo.duration)}</p>
                          <p>Size: {fileUtils.formatFileSize(uploadedVideo.file_size)}</p>
                          <p>Resolution: {uploadedVideo.size[0]}x{uploadedVideo.size[1]}</p>
                        </div>
                      </div>
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-secondary flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  
                  {uploadedVideo && (
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      Process Video
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Video Processing */}
          {currentStep === 4 && (
            <motion.div
              key="process"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <Video className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Process Video</h2>
                <p className="text-gray-600">
                  Combine your video with AI script, narration, and text overlays
                </p>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium text-gray-900">Processing Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Script: {script.split(' ').length} words</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-green-600" />
                      <span>Audio: Generated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>Video: {fileUtils.formatDuration(uploadedVideo?.duration || 0)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-orange-600" />
                      <span>Overlay: Text + Audio</span>
                    </div>
                  </div>
                </div>

                {processing && (
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <CircularProgressbar
                        value={processingProgress}
                        text={`${processingProgress}%`}
                        styles={buildStyles({
                          textSize: '16px',
                          pathColor: '#3B82F6',
                          textColor: '#3B82F6',
                        })}
                      />
                    </div>
                    <h3 className="font-medium text-blue-900 mb-2">Processing Your Video</h3>
                    <p className="text-sm text-blue-700">
                      This may take a few minutes depending on video length...
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={processing}
                    className="btn-secondary flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  
                  <button
                    onClick={processVideo}
                    disabled={processing || !uploadedVideo || !script || !audioFilename}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Start Processing
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Download Result */}
          {currentStep === 5 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card max-w-2xl mx-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Ready! 🎉</h2>
                <p className="text-gray-600">
                  Your video has been processed with AI script and narration
                </p>
              </div>

              <div className="space-y-6">
                {finalVideoUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Processed Video</span>
                      <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                    <video
                      src={apiService.getPreviewUrl(finalVideoFilename)}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: '300px' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={resetWorkflow}
                    className="btn-secondary flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Process Another
                  </button>
                  
                  <button
                    onClick={downloadVideo}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoProcessor; 