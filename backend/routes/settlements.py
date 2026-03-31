from flask import Blueprint, jsonify
from backend.jwt_utils import token_required

settlements_bp = Blueprint('settlements', __name__)

@settlements_bp.route('/', methods=['GET'])
@token_required
def get_settlements(current_user_id):
    """Get user's settlements"""
    return jsonify({
        'message': 'Settlements endpoint working',
        'settlements': [],
        'user_id': current_user_id
    }), 200

@settlements_bp.route('/', methods=['POST'])
@token_required
def create_settlement(current_user_id):
    """Create new settlement"""
    return jsonify({
        'message': 'Create settlement endpoint working',
        'user_id': current_user_id
    }), 200