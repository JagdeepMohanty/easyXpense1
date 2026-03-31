from flask import Blueprint, request, jsonify
from backend.jwt_utils import token_required
from backend.database import get_db
from bson import ObjectId

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/', methods=['GET'])
@token_required
def get_friends(current_user_id):
    """Get user's friends list"""
    try:
        db = get_db()
        
        # Find all accepted friend relationships for current user
        friends = list(db.friends.find({
            "$or": [
                {"requester_id": ObjectId(current_user_id), "status": "accepted"},
                {"recipient_id": ObjectId(current_user_id), "status": "accepted"}
            ]
        }))
        
        friend_list = []
        for friend in friends:
            # Get the other user's ID
            friend_id = friend["recipient_id"] if str(friend["requester_id"]) == current_user_id else friend["requester_id"]
            
            # Get friend's details
            friend_user = db.users.find_one({"_id": friend_id})
            if friend_user:
                friend_list.append({
                    "id": str(friend_user["_id"]),
                    "name": friend_user.get("name", ""),
                    "email": friend_user["email"]
                })
        
        return jsonify({
            'friends': friend_list,
            'count': len(friend_list)
        }), 200
        
    except Exception as e:
        print("Get friends error:", str(e))
        return jsonify({'error': 'Failed to get friends', 'details': str(e)}), 500

@friends_bp.route('/request', methods=['POST'])
@token_required
def send_friend_request(current_user_id):
    """Send friend request"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].strip().lower()
        
        # Prevent self-friending
        db = get_db()
        current_user = db.users.find_one({"_id": ObjectId(current_user_id)})
        if current_user and current_user['email'] == email:
            return jsonify({'error': 'Cannot send friend request to yourself'}), 400
        
        # Find recipient user
        recipient = db.users.find_one({"email": email})
        if not recipient:
            return jsonify({'error': 'User not found'}), 404
        
        recipient_id = recipient["_id"]
        
        # Check if friendship already exists
        existing = db.friends.find_one({
            "$or": [
                {"requester_id": ObjectId(current_user_id), "recipient_id": recipient_id},
                {"requester_id": recipient_id, "recipient_id": ObjectId(current_user_id)}
            ]
        })
        
        if existing:
            if existing["status"] == "accepted":
                return jsonify({'error': 'Already friends'}), 400
            else:
                return jsonify({'error': 'Friend request already sent'}), 400
        
        # Create friend request
        friend_request = {
            "requester_id": ObjectId(current_user_id),
            "recipient_id": recipient_id,
            "status": "pending"
        }
        
        db.friends.insert_one(friend_request)
        
        return jsonify({
            'message': 'Friend request sent successfully',
            'recipient': {
                'name': recipient.get('name', ''),
                'email': recipient['email']
            }
        }), 201
        
    except Exception as e:
        print("Send friend request error:", str(e))
        return jsonify({'error': 'Failed to send friend request', 'details': str(e)}), 500

@friends_bp.route('/requests/pending', methods=['GET'])
@token_required
def get_pending_requests(current_user_id):
    """Get pending friend requests"""
    try:
        db = get_db()
        
        # Find pending requests where current user is recipient
        pending_requests = list(db.friends.find({
            "recipient_id": ObjectId(current_user_id),
            "status": "pending"
        }))
        
        request_list = []
        for request in pending_requests:
            # Get requester's details
            requester = db.users.find_one({"_id": request["requester_id"]})
            if requester:
                request_list.append({
                    "id": str(request["_id"]),
                    "requester": {
                        "id": str(requester["_id"]),
                        "name": requester.get("name", ""),
                        "email": requester["email"]
                    }
                })
        
        return jsonify({
            'requests': request_list,
            'count': len(request_list)
        }), 200
        
    except Exception as e:
        print("Get pending requests error:", str(e))
        return jsonify({'error': 'Failed to get pending requests', 'details': str(e)}), 500

@friends_bp.route('/accept', methods=['POST'])
@token_required
def accept_friend_request(current_user_id):
    """Accept friend request"""
    try:
        data = request.get_json()
        
        if not data or not data.get('request_id'):
            return jsonify({'error': 'Request ID is required'}), 400
        
        request_id = data['request_id']
        
        db = get_db()
        
        # Find and update the friend request
        result = db.friends.update_one(
            {
                "_id": ObjectId(request_id),
                "recipient_id": ObjectId(current_user_id),
                "status": "pending"
            },
            {"$set": {"status": "accepted"}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Friend request not found'}), 404
        
        return jsonify({'message': 'Friend request accepted'}), 200
        
    except Exception as e:
        print("Accept friend request error:", str(e))
        return jsonify({'error': 'Failed to accept friend request', 'details': str(e)}), 500