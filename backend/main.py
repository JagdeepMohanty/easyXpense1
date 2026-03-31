from flask import Flask, jsonify
from flask_cors import CORS
import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app (GLOBAL - required for Gunicorn)
app = Flask(__name__)

# Configure CORS for production and development
CORS(app, origins=[
    'http://localhost:3000',
    'http://localhost:5173',
    'https://easyxpense.netlify.app'
], supports_credentials=True)

# Global database connection
db = None
client = None

def init_database():
    """Initialize database connection with retry logic"""
    global db, client
    
    # Get MongoDB URI from environment
    MONGO_URI = os.getenv('MONGO_URI')
    
    if not MONGO_URI:
        logger.warning("MONGO_URI not set, using localhost fallback")
        MONGO_URI = "mongodb://localhost:27017"
    
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting MongoDB connection (attempt {attempt + 1}/{max_retries})")
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            
            # Test connection
            client.admin.command('ping')
            db = client["easyxpense"]
            
            logger.info("✅ MongoDB connected successfully")
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.warning(f"❌ MongoDB connection failed (attempt {attempt + 1}): {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                logger.error("❌ All MongoDB connection attempts failed")
                return False
        except Exception as e:
            logger.error(f"❌ Unexpected database error: {str(e)}")
            return False
    
    return False

def get_db():
    """Get database connection, initialize if needed"""
    global db
    if db is None:
        init_database()
    return db

# Global error handler
@app.errorhandler(Exception)
def handle_error(e):
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.errorhandler(404)
def handle_404(e):
    return jsonify({"error": "Not found", "message": "Endpoint not found"}), 404

@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Internal server error"}), 500

# Health check endpoint (MANDATORY for Render)
@app.route('/')
def home():
    return jsonify({"message": "EasyXpense API running", "status": "healthy"})

@app.route('/api/health')
def health():
    """Comprehensive health check"""
    health_status = {
        "status": "healthy",
        "database": "disconnected",
        "timestamp": time.time()
    }
    
    try:
        # Check database connection
        database = get_db()
        if database is not None:
            # Test database with a simple operation
            database.command('ping')
            health_status["database"] = "connected"
        else:
            health_status["database"] = "disconnected"
            health_status["status"] = "degraded"
    except Exception as e:
        logger.warning(f"Health check database error: {str(e)}")
        health_status["database"] = "error"
        health_status["status"] = "degraded"
    
    status_code = 200 if health_status["status"] in ["healthy", "degraded"] else 503
    return jsonify(health_status), status_code

# Basic API endpoints for testing
@app.route('/api/test')
def test_endpoint():
    return jsonify({"message": "API test successful", "database_status": "connected" if db else "disconnected"})

# Import and register blueprints with error handling
def register_blueprints():
    """Register all blueprints with error handling"""
    try:
        # Import blueprints
        from routes.auth import auth_bp
        from routes.friends import friends_bp
        from routes.groups import groups_bp
        from routes.expenses import expenses_bp
        from routes.debts import debts_bp
        from routes.settlements import settlements_bp
        from routes.analytics import analytics_bp
        
        # Register blueprints
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(friends_bp, url_prefix='/api/friends')
        app.register_blueprint(groups_bp, url_prefix='/api/groups')
        app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
        app.register_blueprint(debts_bp, url_prefix='/api/debts')
        app.register_blueprint(settlements_bp, url_prefix='/api/settlements')
        app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
        
        logger.info("✅ All blueprints registered successfully")
        return True
        
    except ImportError as e:
        logger.warning(f"⚠️ Could not import some blueprints: {str(e)}")
        logger.info("Running with basic routes only")
        return False
    except Exception as e:
        logger.error(f"❌ Blueprint registration error: {str(e)}")
        return False

# Initialize application
def initialize_app():
    """Initialize the application with all components"""
    logger.info("🚀 Starting EasyXpense API...")
    
    # Initialize database
    db_success = init_database()
    if db_success:
        logger.info("✅ Database initialization successful")
    else:
        logger.warning("⚠️ Database initialization failed, continuing with limited functionality")
    
    # Register blueprints
    blueprint_success = register_blueprints()
    if blueprint_success:
        logger.info("✅ Blueprint registration successful")
    else:
        logger.warning("⚠️ Some blueprints failed to register")
    
    logger.info("🎉 EasyXpense API initialization complete")

# Initialize on import (safe for Gunicorn)
try:
    initialize_app()
except Exception as e:
    logger.error(f"❌ Application initialization failed: {str(e)}")
    # Don't crash - let the app start with basic functionality

# Development server
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') != 'production'
    
    logger.info(f"🔧 Starting development server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)