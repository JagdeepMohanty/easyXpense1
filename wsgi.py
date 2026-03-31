"""
WSGI entry point for Gunicorn deployment
"""

import os
import sys

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import Flask app from main.py
from main import app

# This is what Gunicorn will use
application = app

if __name__ == "__main__":
    app.run()