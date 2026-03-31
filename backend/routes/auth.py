from flask import Blueprint, request, jsonify
from backend.database import get_db
import bcrypt
import jwt
import os

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db = get_db()

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Missing fields"}), 400

        # Check if user already exists
        existing = db.users.find_one({"email": data["email"]})
        if existing:
            return jsonify({"error": "User already exists"}), 400

        # Hash password
        hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

        # Create user document
        user = {
            "name": data.get("name", ""),
            "email": data["email"],
            "password": hashed
        }

        # Insert user into database
        result = db.users.insert_one(user)
        
        if result.inserted_id:
            return jsonify({"message": "User registered successfully"}), 201
        else:
            return jsonify({"error": "Registration failed"}), 500

    except Exception as e:
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db = get_db()

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Missing email or password"}), 400

        # Find user by email
        user = db.users.find_one({"email": data.get("email")})

        # Check credentials
        if not user or not bcrypt.checkpw(data["password"].encode(), user["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate JWT token
        jwt_secret = os.getenv("JWT_SECRET")
        if not jwt_secret:
            return jsonify({"error": "JWT configuration error"}), 500

        token = jwt.encode(
            {"user_id": str(user["_id"])},
            jwt_secret,
            algorithm="HS256"
        )

        return jsonify({
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user["email"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "No token provided"}), 401

        try:
            token = auth_header.split(" ")[1]  # Bearer <token>
        except IndexError:
            return jsonify({"error": "Invalid token format"}), 401

        # Decode token
        jwt_secret = os.getenv("JWT_SECRET")
        if not jwt_secret:
            return jsonify({"error": "JWT configuration error"}), 500

        try:
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
            user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        # Get user from database
        db = get_db()
        from bson import ObjectId
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "user": {
                "id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user["email"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 500