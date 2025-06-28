#!/usr/bin/env python3
"""
VideoScriptify Backend Server
Run this script to start the Flask development server
"""

import os
from app import app
from config import config

if __name__ == '__main__':
    # Get configuration based on environment
    config_name = os.getenv('FLASK_ENV', 'development')
    app_config = config.get(config_name, config['default'])
    
    # Configure the app
    app.config.from_object(app_config)
    
    # Run the application
    print("🎬 Starting VideoScriptify Backend Server...")
    print("📡 Server will be available at: http://localhost:5001")
    print("📖 API Documentation: http://localhost:5000/api/health")
    print("🔧 Environment:", config_name)
    
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=app_config.DEBUG
    ) 