from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# FIX CORS - specific origins
CORS(app, origins=["http://localhost:5173", "https://easyxpense.netlify.app"])

# GLOBAL ERROR HANDLER
@app.errorhandler(Exception)
def handle_error(e):
    return {"error": str(e)}, 500

@app.errorhandler(404)
def handle_404(e):
    return {"error": "Not found"}, 404

@app.errorhandler(500)
def handle_500(e):
    return {"error": "Internal server error"}, 500

@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

@app.route("/api/health")
def health():
    try:
        # Test database connection
        from backend.database import get_db
        db = get_db()
        db.command('ping')
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": "disconnected", "error": str(e)}

# SAFE LAZY IMPORTS (CRITICAL)
def register_routes():
    try:
        from backend.routes.auth import auth_bp
        from backend.routes.friends import friends_bp
        from backend.routes.groups import groups_bp
        from backend.routes.expenses import expenses_bp
        from backend.routes.settlements import settlements_bp
        from backend.routes.debts import debts_bp
        from backend.routes.analytics import analytics_bp

        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(friends_bp, url_prefix="/api/friends")
        app.register_blueprint(groups_bp, url_prefix="/api/groups")
        app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
        app.register_blueprint(settlements_bp, url_prefix="/api/settlements")
        app.register_blueprint(debts_bp, url_prefix="/api/debts")
        app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

        print("All routes loaded")

    except Exception as e:
        print("Route import error:", e)
        print("Running with basic routes only")

register_routes()