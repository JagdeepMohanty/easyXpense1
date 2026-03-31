import jwt
import os
from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token safely
            jwt_secret = os.getenv('JWT_SECRET')
            if not jwt_secret:
                return jsonify({'error': 'JWT configuration error'}), 500
                
            data = jwt.decode(token, jwt_secret, algorithms=['HS256'])
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'error': 'Token validation failed'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

def generate_token(user_id):
    try:
        import datetime
        jwt_secret = os.getenv('JWT_SECRET')
        if not jwt_secret:
            return None
            
        payload = {
            'user_id': str(user_id),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        
        return jwt.encode(payload, jwt_secret, algorithm='HS256')
    except:
        return None