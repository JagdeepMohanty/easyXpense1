import jwt
import os
from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        try:
            # Get token from header
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                try:
                    token = auth_header.split(" ")[1]  # Bearer <token>
                except (IndexError, AttributeError):
                    return jsonify({'error': 'Invalid token format'}), 401
            
            if not token:
                return jsonify({'error': 'Token is missing'}), 401
            
            # Get JWT secret
            jwt_secret = os.getenv('JWT_SECRET')
            if not jwt_secret:
                return jsonify({'error': 'JWT configuration error'}), 500
            
            # Decode token
            try:
                data = jwt.decode(token, jwt_secret, algorithms=['HS256'])
                current_user_id = data.get('user_id')
                
                if not current_user_id:
                    return jsonify({'error': 'Invalid token payload'}), 401
                    
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Token is invalid'}), 401
            except Exception as e:
                return jsonify({'error': 'Token validation failed'}), 401
            
            # Call the decorated function with user_id
            return f(current_user_id, *args, **kwargs)
            
        except Exception as e:
            print("JWT Middleware Error:", str(e))
            return jsonify({'error': 'Authentication failed'}), 401
    
    return decorated

def generate_token(user_id):
    """Generate JWT token safely"""
    try:
        import datetime
        
        jwt_secret = os.getenv('JWT_SECRET')
        if not jwt_secret:
            return None
            
        payload = {
            'user_id': str(user_id),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')
        return token
        
    except Exception as e:
        print("Token generation error:", str(e))
        return None