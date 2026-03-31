"""
Root-level Flask app entry point for Gunicorn
This file ensures Gunicorn can find the Flask app instance
"""

import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the Flask app from backend
try:
    from main import app
    print("✅ Successfully imported Flask app from backend")
except ImportError as e:
    print(f"❌ Failed to import Flask app: {e}")
    # Create a minimal fallback app
    from flask import Flask
    app = Flask(__name__)
    
    @app.route('/')
    def fallback():
        return {"error": "Backend import failed", "message": str(e)}, 500

# Ensure app is available for Gunicorn
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))