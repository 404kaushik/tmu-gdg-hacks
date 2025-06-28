import axios from 'axios';

// API base URL - adjust this based on your backend setup
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for video processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data.error || `Server error: ${status}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API functions
export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Generate script from prompt
  generateScript: async (prompt, duration = 30) => {
    const response = await api.post('/api/generate-script', {
      prompt,
      duration,
    });
    return response.data;
  },

  // Generate audio from script
  generateAudio: async (script, voice = 'default') => {
    const response = await api.post('/api/generate-audio', {
      script,
      voice,
    });
    return response.data;
  },

  // Upload video file
  uploadVideo: async (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('video', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await api.post('/api/upload-video', formData, config);
    return response.data;
  },

  // Add overlay to video
  addOverlay: async (videoFilename, script, audioFilename = null, overlayText = null) => {
    const response = await api.post('/api/add-overlay', {
      video_filename: videoFilename,
      script,
      audio_filename: audioFilename,
      overlay_text: overlayText,
    });
    return response.data;
  },

  // Get processing status
  getProcessingStatus: async (processId) => {
    const response = await api.get(`/api/processing-status/${processId}`);
    return response.data;
  },

  // Download file
  downloadFile: async (filename) => {
    const response = await api.get(`/api/download/${filename}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Get preview URL
  getPreviewUrl: (filename) => {
    return `${API_BASE_URL}/api/preview/${filename}`;
  },

  // Get download URL
  getDownloadUrl: (filename) => {
    return `${API_BASE_URL}/api/download/${filename}`;
  },
};

// Utility functions
export const fileUtils = {
  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format duration
  formatDuration: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  // Validate video file
  isValidVideoFile: (file) => {
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
    return validTypes.includes(file.type);
  },

  // Get file extension
  getFileExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },
};

// Error handling utility
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  return error.message || defaultMessage;
};

export default api; 