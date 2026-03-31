from flask import Blueprint, jsonify
from backend.jwt_utils import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['GET'])
@token_required
def get_analytics(current_user_id):
    """Get user's analytics"""
    return jsonify({
        'message': 'Analytics endpoint working',
        'analytics': {
            'total_expenses': 0,
            'total_debts': 0,
            'total_settlements': 0
        },
        'user_id': current_user_id
    }), 200