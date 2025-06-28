import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Replicate API Configuration
    REPLICATE_API_TOKEN = os.getenv('REPLICATE_API_TOKEN', '')
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # CORS Configuration
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3001')
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', '100')) * 1024 * 1024  # Convert MB to bytes
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    OUTPUT_FOLDER = os.getenv('OUTPUT_FOLDER', 'public/videos')
    ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}
    
    # Video Processing Configuration
    DEFAULT_VIDEO_CODEC = os.getenv('DEFAULT_VIDEO_CODEC', 'libx264')
    DEFAULT_AUDIO_CODEC = os.getenv('DEFAULT_AUDIO_CODEC', 'aac')
    DEFAULT_VIDEO_QUALITY = os.getenv('DEFAULT_VIDEO_QUALITY', 'medium')
    
    # Text Overlay Configuration
    DEFAULT_FONT_SIZE_RATIO = 0.06  # Font size as ratio of video height
    DEFAULT_TEXT_COLOR = 'white'
    DEFAULT_STROKE_COLOR = 'black'
    DEFAULT_STROKE_WIDTH = 2
    DEFAULT_TEXT_POSITION = ('center', 0.85)  # Relative position (x, y)
    DEFAULT_TEXT_WIDTH_RATIO = 0.8  # Text width as ratio of video width
    
    # Audio Processing Configuration
    ORIGINAL_AUDIO_VOLUME = 0.3  # 30% of original volume
    NARRATION_VOLUME = 1.0  # 100% narration volume
    
    # API Configuration
    API_VERSION = os.getenv('API_VERSION', 'v1')
    API_RATE_LIMIT = int(os.getenv('API_RATE_LIMIT', '100'))  # requests per minute

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 