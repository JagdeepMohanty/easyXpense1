from flask import Blueprint, request, jsonify
from models.user_model import User
from models.friend_model import Friend
from middleware.auth_middleware import token_required
from bson import ObjectId
from datetime import datetime

friends_bp = Blueprint('friends', __name__)
user_model = User()
friend_model = Friend()

@friends_bp.route('/request', methods=['POST'])
@token_required
def send_friend_request(current_user):
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'message': 'Email is required'}), 400
    
    receiver = user_model.find_by_email(data['email'])
    
    if not receiver:
        return jsonify({'message': 'User not found'}), 404
    
    sender_id = str(current_user['_id'])
    receiver_id = str(receiver['_id'])
    
    if sender_id == receiver_id:
        return jsonify({'message': 'Cannot send friend request to yourself'}), 400
    
    if friend_model.are_friends(sender_id, receiver_id):
        return jsonify({'message': 'Already friends'}), 400
    
    if friend_model.request_exists(sender_id, receiver_id):
        return jsonify({'message': 'Friend request already sent'}), 400
    
    friend_model.create_request(sender_id, receiver_id)
    return jsonify({'message': 'Friend request sent'}), 201

@friends_bp.route('/accept', methods=['POST'])
@token_required
def accept_friend_request(current_user):
    data = request.get_json()
    
    if not data or not data.get('request_id'):
        return jsonify({'message': 'Request ID is required'}), 400
    
    try:
        friend_request = friend_model.get_request(data['request_id'])
    except:
        return jsonify({'message': 'Invalid request ID'}), 400
    
    if not friend_request:
        return jsonify({'message': 'Friend request not found'}), 404
    
    if str(friend_request['receiver_id']) != str(current_user['_id']):
        return jsonify({'message': 'Unauthorized'}), 403
    
    if friend_request['status'] != 'pending':
        return jsonify({'message': 'Request already processed'}), 400
    
    friend_model.accept_request(data['request_id'])
    friend_model.create_friendship(
        str(friend_request['sender_id']),
        str(friend_request['receiver_id'])
    )
    
    return jsonify({'message': 'Friend request accepted'}), 200

@friends_bp.route('', methods=['GET'])
@token_required
def get_friends(current_user):
    user_id = str(current_user['_id'])
    friends = friend_model.get_friends(user_id)
    
    friends_list = []
    for friend in friends:
        friend_user = user_model.find_by_id(friend['friend_id'])
        if friend_user:
            friends_list.append({
                'id': str(friend_user['_id']),
                'name': friend_user['name'],
                'email': friend_user['email']
            })
    
    return jsonify(friends_list), 200

@friends_bp.route('/requests/pending', methods=['GET'])
@token_required
def get_pending_requests(current_user):
    user_id = str(current_user['_id'])
    requests = friend_model.get_pending_requests(user_id)
    
    requests_list = []
    for req in requests:
        sender = user_model.find_by_id(str(req['sender_id']))
        if sender:
            requests_list.append({
                'request_id': str(req['_id']),
                'sender_id': str(sender['_id']),
                'name': sender['name'],
                'email': sender['email']
            })
    
    return jsonify(requests_list), 200
