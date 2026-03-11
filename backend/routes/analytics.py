from flask import Blueprint, jsonify
from models.expense_model import Expense
from models.group_model import Group
from middleware.auth_middleware import token_required

analytics_bp = Blueprint('analytics', __name__)
expense_model = Expense()
group_model = Group()

@analytics_bp.route('', methods=['GET'])
@token_required
def get_user_analytics(current_user):
    user_id = str(current_user['_id'])
    
    # Get user's expenses
    expenses = expense_model.get_user_expenses(user_id)
    
    # Calculate total expenses
    total_expenses = sum(expense['amount'] for expense in expenses if str(expense['paid_by']) == user_id)
    
    # Get user's groups
    groups = group_model.get_user_groups(user_id)
    groups_count = len(groups)
    
    # Count expenses
    expenses_count = len([e for e in expenses if str(e['paid_by']) == user_id])
    
    return jsonify({
        'total_expenses': round(total_expenses, 2),
        'groups_count': groups_count,
        'expenses_count': expenses_count
    }), 200
