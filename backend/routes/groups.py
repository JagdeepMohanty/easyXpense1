from flask import Blueprint, jsonify
from auth_middleware import token_required

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/', methods=['GET'])
@token_required
def get_groups(current_user_id):
    """Get user's groups"""
    return jsonify({
        'message': 'Groups endpoint working',
        'groups': [],
        'user_id': current_user_id
    }), 200

@groups_bp.route('/', methods=['POST'])
@token_required
def create_group(current_user_id):
    """Create new group"""
    return jsonify({
        'message': 'Create group endpoint working',
        'user_id': current_user_id
    }), 200