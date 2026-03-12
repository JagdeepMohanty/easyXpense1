from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.health import health_bp
from routes.auth import auth_bp
from routes.friends import friends_bp
from routes.groups import groups_bp
from routes.expenses import expenses_bp
from routes.debts import debts_bp
from routes.settlements import settlements_bp
from routes.analytics import analytics_bp
from config.config import Config
import os

# Load environment variables
load_dotenv()

# Validate required environment variables
if not Config.MONGO_URI:
    raise ValueError("MONGO_URI environment variable is required")
if not Config.JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")

app = Flask(__name__)

# Configure CORS for production and development
allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://easyxpense.netlify.app'
]
CORS(app, origins=allowed_origins, supports_credentials=True)

# Root route for production
@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

# Direct health check route
@app.route("/api/health")
def health():
    return {"status": "ok"}

# Register blueprints
app.register_blueprint(health_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(friends_bp, url_prefix='/api/friends')
app.register_blueprint(groups_bp, url_prefix='/api/groups')
app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
app.register_blueprint(debts_bp, url_prefix='/api/debts')
app.register_blueprint(settlements_bp, url_prefix='/api/settlements')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

if __name__ == '__main__':
    port = Config.PORT
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
