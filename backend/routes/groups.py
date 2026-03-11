from flask import Blueprint, request, jsonify
from models.user_model import User
from models.group_model import Group
from models.friend_model import Friend
from middleware.auth_middleware import token_required
from bson import ObjectId

groups_bp = Blueprint('groups', __name__)
user_model = User()
group_model = Group()
friend_model = Friend()

@groups_bp.route('', methods=['POST'])
@token_required
def create_group(current_user):
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'message': 'Group name is required'}), 400
    
    user_id = str(current_user['_id'])
    group_id = group_model.create_group(data['name'], user_id)
    
    return jsonify({
        'message': 'Group created',
        'group_id': group_id
    }), 201

@groups_bp.route('', methods=['GET'])
@token_required
def get_user_groups(current_user):
    user_id = str(current_user['_id'])
    groups = group_model.get_user_groups(user_id)
    
    groups_list = []
    for group in groups:
        groups_list.append({
            'id': str(group['_id']),
            'name': group['name']
        })
    
    return jsonify(groups_list), 200

@groups_bp.route('/<group_id>', methods=['GET'])
@token_required
def get_group_details(current_user, group_id):
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(group_id, user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    members_list = []
    for member_id in group['members']:
        member = user_model.find_by_id(str(member_id))
        if member:
            members_list.append({
                'id': str(member['_id']),
                'name': member['name'],
                'email': member['email']
            })
    
    return jsonify({
        'id': str(group['_id']),
        'name': group['name'],
        'members': members_list
    }), 200

@groups_bp.route('/<group_id>/members', methods=['POST'])
@token_required
def add_member(current_user, group_id):
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'message': 'Email is required'}), 400
    
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(group_id, user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    new_member = user_model.find_by_email(data['email'])
    if not new_member:
        return jsonify({'message': 'User not found'}), 404
    
    new_member_id = str(new_member['_id'])
    
    if new_member_id == user_id:
        return jsonify({'message': 'You are already a member'}), 400
    
    if not friend_model.are_friends(user_id, new_member_id):
        return jsonify({'message': 'You can only add friends to the group'}), 400
    
    if group_model.is_already_member(group_id, new_member_id):
        return jsonify({'message': 'User is already a member'}), 400
    
    group_model.add_member(group_id, new_member_id)
    
    return jsonify({'message': 'Member added'}), 200
