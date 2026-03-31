from flask import Blueprint, jsonify
from auth_middleware import token_required

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/', methods=['GET'])
@token_required
def get_friends(current_user_id):
    """Get user's friends list"""
    return jsonify({
        'message': 'Friends endpoint working',
        'friends': [],
        'user_id': current_user_id
    }), 200

@friends_bp.route('/request', methods=['POST'])
@token_required
def send_friend_request(current_user_id):
    """Send friend request"""
    return jsonify({
        'message': 'Friend request endpoint working',
        'user_id': current_user_id
    }), 200