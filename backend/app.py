from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
if mongo_uri:
    try:
        client = MongoClient(mongo_uri)
        db = client["easyxpense"]
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        db = None
else:
    print("MONGO_URI not found")
    db = None

@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

@app.route("/api/health")
def health():
    return {"status": "ok"}

# Import and register blueprints with error handling
try:
    from config.config import Config
    
    # Import blueprints
    from routes.health import health_bp
    from routes.auth import auth_bp
    from routes.friends import friends_bp
    from routes.groups import groups_bp
    from routes.expenses import expenses_bp
    from routes.debts import debts_bp
    from routes.settlements import settlements_bp
    from routes.analytics import analytics_bp
    
    # Register blueprints
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(friends_bp, url_prefix='/api/friends')
    app.register_blueprint(groups_bp, url_prefix='/api/groups')
    app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
    app.register_blueprint(debts_bp, url_prefix='/api/debts')
    app.register_blueprint(settlements_bp, url_prefix='/api/settlements')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    print("All blueprints registered successfully")
    
except ImportError as e:
    print(f"Warning: Could not import some modules: {e}")
    print("Running with basic routes only")
except Exception as e:
    print(f"Warning: Configuration error: {e}")
    print("Running with basic routes only")

if __name__ == '__main__':
    try:
        from config.config import Config
        port = Config.PORT
    except:
        port = int(os.getenv('PORT', 5000))
    
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
