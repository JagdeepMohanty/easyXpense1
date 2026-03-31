from flask import Blueprint, jsonify
from backend.jwt_utils import token_required

debts_bp = Blueprint('debts', __name__)

@debts_bp.route('/', methods=['GET'])
@token_required
def get_debts(current_user_id):
    """Get user's debts"""
    return jsonify({
        'message': 'Debts endpoint working',
        'debts': [],
        'user_id': current_user_id
    }), 200