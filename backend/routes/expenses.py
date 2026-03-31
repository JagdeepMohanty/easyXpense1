from flask import Blueprint, jsonify
from auth_middleware import token_required

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    """Get user's expenses"""
    return jsonify({
        'message': 'Expenses endpoint working',
        'expenses': [],
        'user_id': current_user_id
    }), 200

@expenses_bp.route('/', methods=['POST'])
@token_required
def create_expense(current_user_id):
    """Create new expense"""
    return jsonify({
        'message': 'Create expense endpoint working',
        'user_id': current_user_id
    }), 200