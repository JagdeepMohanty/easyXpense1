import jwt
import logging
from functools import wraps
from flask import request, jsonify, current_app
from config import Config

logger = logging.getLogger(__name__)

def token_required(f):
    """JWT token validation decorator with comprehensive error handling"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                logger.warning("Malformed Authorization header")
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            logger.warning("No token provided")
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(
                token, 
                Config.JWT_SECRET, 
                algorithms=[Config.JWT_ALGORITHM]
            )
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return jsonify({'error': 'Token has expired'}), 401
            
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {str(e)}")
            return jsonify({'error': 'Token is invalid'}), 401
            
        except KeyError:
            logger.warning("Token missing user_id")
            return jsonify({'error': 'Invalid token payload'}), 401
            
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return jsonify({'error': 'Token validation failed'}), 401
        
        # Pass user_id to the route
        return f(current_user_id, *args, **kwargs)
    
    return decorated

def generate_token(user_id):
    """Generate JWT token safely"""
    try:
        import datetime
        
        payload = {
            'user_id': str(user_id),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)
        return token
        
    except Exception as e:
        logger.error(f"Token generation error: {str(e)}")
        return None

def decode_token(token):
    """Decode JWT token safely"""
    try:
        data = jwt.decode(
            token, 
            Config.JWT_SECRET, 
            algorithms=[Config.JWT_ALGORITHM]
        )
        return data
    except Exception as e:
        logger.warning(f"Token decode error: {str(e)}")
        return None