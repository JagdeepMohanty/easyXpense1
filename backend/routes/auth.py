from flask import Blueprint, request, jsonify
from models.user_model import User
import jwt
from datetime import datetime, timedelta
from app.jwt_config import JWT_SECRET
from middleware.auth_middleware import token_required
from pymongo.errors import DuplicateKeyError

auth_bp = Blueprint('auth', __name__)
user_model = User()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Name, email and password are required'}), 400
    
    try:
        user_model.create_user(data['name'], data['email'], data['password'])
        return jsonify({'message': 'User registered successfully'}), 201
    except DuplicateKeyError:
        return jsonify({'message': 'Email already exists'}), 400
    except Exception as e:
        return jsonify({'message': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = user_model.find_by_email(data['email'])
    
    if not user or not user_model.verify_password(data['password'], user['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, JWT_SECRET, algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'id': str(current_user['_id']),
        'name': current_user['name'],
        'email': current_user['email']
    }), 200
