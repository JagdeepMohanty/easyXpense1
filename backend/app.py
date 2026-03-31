from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

@app.route("/api/health")
def health():
    return {"status": "ok"}

# SAFE LAZY IMPORTS (CRITICAL)
def register_routes():
    try:
        from routes.auth import auth_bp
        from routes.friends import friends_bp
        from routes.groups import groups_bp
        from routes.expenses import expenses_bp

        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        app.register_blueprint(friends_bp, url_prefix="/api/friends")
        app.register_blueprint(groups_bp, url_prefix="/api/groups")
        app.register_blueprint(expenses_bp, url_prefix="/api/expenses")

    except Exception as e:
        print("Route import error:", e)

register_routes()