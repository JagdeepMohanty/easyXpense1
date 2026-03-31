from flask import Blueprint, request, jsonify
import bcrypt
import logging
from bson import ObjectId
from database import get_database
from auth_middleware import generate_token, token_required

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration with comprehensive error handling"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        name = data['name'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Basic validation
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Get database
        db = get_database()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 503
        
        # Check if user exists
        existing_user = db.users.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': ObjectId().generation_time
        }
        
        result = db.users.insert_one(user_data)
        user_id = result.inserted_id
        
        # Generate token
        token = generate_token(user_id)
        if not token:
            return jsonify({'error': 'Token generation failed'}), 500
        
        logger.info(f"User registered successfully: {email}")
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': str(user_id),
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login with comprehensive error handling"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Get database
        db = get_database()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 503
        
        # Find user
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user['_id'])
        if not token:
            return jsonify({'error': 'Token generation failed'}), 500
        
        logger.info(f"User logged in successfully: {email}")
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user_id):
    """Get current user information"""
    try:
        # Get database
        db = get_database()
        if not db:
            return jsonify({'error': 'Database connection failed'}), 503
        
        # Find user
        user = db.users.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        return jsonify({'error': 'Failed to get user information'}), 500