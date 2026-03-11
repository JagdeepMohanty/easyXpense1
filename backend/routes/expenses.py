from flask import Blueprint, request, jsonify
from models.user_model import User
from models.group_model import Group
from models.expense_model import Expense
from middleware.auth_middleware import token_required
from bson import ObjectId

expenses_bp = Blueprint('expenses', __name__)
user_model = User()
group_model = Group()
expense_model = Expense()

@expenses_bp.route('', methods=['POST'])
@token_required
def create_expense(current_user):
    data = request.get_json()
    
    if not data or not data.get('group_id') or not data.get('description') or not data.get('amount') or not data.get('paid_by') or not data.get('participants'):
        return jsonify({'message': 'All fields are required'}), 400
    
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'message': 'Amount must be greater than 0'}), 400
    except ValueError:
        return jsonify({'message': 'Invalid amount'}), 400
    
    try:
        group = group_model.get_group_by_id(data['group_id'])
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(data['group_id'], user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    if not group_model.is_member(data['group_id'], data['paid_by']):
        return jsonify({'message': 'Payer must be a group member'}), 400
    
    if not data['participants'] or len(data['participants']) == 0:
        return jsonify({'message': 'At least one participant is required'}), 400
    
    for participant_id in data['participants']:
        if not group_model.is_member(data['group_id'], participant_id):
            return jsonify({'message': 'All participants must be group members'}), 400
    
    expense_id, split_amount = expense_model.create_expense(
        data['group_id'],
        data['description'],
        amount,
        data['paid_by'],
        data['participants']
    )
    
    return jsonify({
        'message': 'Expense created',
        'expense_id': expense_id,
        'split_amount': split_amount
    }), 201

@expenses_bp.route('', methods=['GET'])
@token_required
def get_user_expenses(current_user):
    user_id = str(current_user['_id'])
    expenses = expense_model.get_user_expenses(user_id)
    
    expenses_list = []
    for expense in expenses:
        paid_by_user = user_model.find_by_id(str(expense['paid_by']))
        group = group_model.get_group_by_id(str(expense['group_id']))
        
        expenses_list.append({
            'id': str(expense['_id']),
            'description': expense['description'],
            'amount': expense['amount'],
            'split_amount': expense['split_amount'],
            'paid_by': paid_by_user['name'] if paid_by_user else 'Unknown',
            'group_name': group['name'] if group else 'Unknown',
            'created_at': expense['created_at'].isoformat()
        })
    
    return jsonify(expenses_list), 200

@expenses_bp.route('/groups/<group_id>', methods=['GET'])
@token_required
def get_group_expenses(current_user, group_id):
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(group_id, user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    expenses = expense_model.get_group_expenses(group_id)
    
    expenses_list = []
    for expense in expenses:
        paid_by_user = user_model.find_by_id(str(expense['paid_by']))
        
        participants_names = []
        for participant_id in expense['participants']:
            participant = user_model.find_by_id(str(participant_id))
            if participant:
                participants_names.append(participant['name'])
        
        expenses_list.append({
            'id': str(expense['_id']),
            'description': expense['description'],
            'amount': expense['amount'],
            'split_amount': expense['split_amount'],
            'paid_by': paid_by_user['name'] if paid_by_user else 'Unknown',
            'participants': participants_names,
            'created_at': expense['created_at'].isoformat()
        })
    
    return jsonify(expenses_list), 200
