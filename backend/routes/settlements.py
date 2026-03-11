from flask import Blueprint, request, jsonify
from models.user_model import User
from models.group_model import Group
from models.settlement_model import Settlement
from middleware.auth_middleware import token_required
from bson import ObjectId

settlements_bp = Blueprint('settlements', __name__)
user_model = User()
group_model = Group()
settlement_model = Settlement()

@settlements_bp.route('', methods=['POST'])
@token_required
def settle_debt(current_user):
    data = request.get_json()
    
    if not data or not data.get('receiver_id') or not data.get('group_id') or not data.get('amount'):
        return jsonify({'message': 'Receiver, group, and amount are required'}), 400
    
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'message': 'Amount must be greater than 0'}), 400
    except ValueError:
        return jsonify({'message': 'Invalid amount'}), 400
    
    payer_id = str(current_user['_id'])
    receiver_id = data['receiver_id']
    group_id = data['group_id']
    
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    if not group_model.is_member(group_id, payer_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    if not group_model.is_member(group_id, receiver_id):
        return jsonify({'message': 'Receiver is not a member of this group'}), 400
    
    if payer_id == receiver_id:
        return jsonify({'message': 'Cannot settle with yourself'}), 400
    
    settlement_model.create_settlement(payer_id, receiver_id, group_id, amount)
    
    return jsonify({'message': 'Payment recorded successfully'}), 201

@settlements_bp.route('', methods=['GET'])
@token_required
def get_user_settlements(current_user):
    user_id = str(current_user['_id'])
    settlements = settlement_model.get_user_settlements(user_id)
    
    settlements_list = []
    for settlement in settlements:
        payer = user_model.find_by_id(str(settlement['payer_id']))
        receiver = user_model.find_by_id(str(settlement['receiver_id']))
        group = group_model.get_group_by_id(str(settlement['group_id']))
        
        settlements_list.append({
            'id': str(settlement['_id']),
            'payer': payer['name'] if payer else 'Unknown',
            'receiver': receiver['name'] if receiver else 'Unknown',
            'group_name': group['name'] if group else 'Unknown',
            'amount': settlement['amount'],
            'created_at': settlement['created_at'].isoformat()
        })
    
    return jsonify(settlements_list), 200

@settlements_bp.route('/groups/<group_id>', methods=['GET'])
@token_required
def get_group_settlements(current_user, group_id):
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(group_id, user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    settlements = settlement_model.get_group_settlements(group_id)
    
    settlements_list = []
    for settlement in settlements:
        payer = user_model.find_by_id(str(settlement['payer_id']))
        receiver = user_model.find_by_id(str(settlement['receiver_id']))
        
        settlements_list.append({
            'id': str(settlement['_id']),
            'payer': payer['name'] if payer else 'Unknown',
            'receiver': receiver['name'] if receiver else 'Unknown',
            'amount': settlement['amount'],
            'created_at': settlement['created_at'].isoformat()
        })
    
    return jsonify(settlements_list), 200
