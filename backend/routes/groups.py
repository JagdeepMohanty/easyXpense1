from flask import Blueprint, request, jsonify
from backend.jwt_utils import token_required
from backend.database import get_db
from bson import ObjectId

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/', methods=['GET'])
@token_required
def get_groups(current_user_id):
    """Get user's groups"""
    try:
        db = get_db()
        
        # Find groups where user is a member
        groups = list(db.groups.find({
            "members": ObjectId(current_user_id)
        }))
        
        group_list = []
        for group in groups:
            # Get member details
            members = []
            for member_id in group.get("members", []):
                member = db.users.find_one({"_id": member_id})
                if member:
                    members.append({
                        "id": str(member["_id"]),
                        "name": member.get("name", ""),
                        "email": member["email"]
                    })
            
            group_list.append({
                "id": str(group["_id"]),
                "name": group["name"],
                "created_by": str(group["created_by"]),
                "members": members,
                "member_count": len(members)
            })
        
        return jsonify({
            'groups': group_list,
            'count': len(group_list)
        }), 200
        
    except Exception as e:
        print("Get groups error:", str(e))
        return jsonify({'error': 'Failed to get groups', 'details': str(e)}), 500

@groups_bp.route('/', methods=['POST'])
@token_required
def create_group(current_user_id):
    """Create new group"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Group name is required'}), 400
        
        name = data['name'].strip()
        
        if len(name) < 1:
            return jsonify({'error': 'Group name cannot be empty'}), 400
        
        db = get_db()
        
        # Create group
        group = {
            "name": name,
            "created_by": ObjectId(current_user_id),
            "members": [ObjectId(current_user_id)]  # Creator is automatically a member
        }
        
        result = db.groups.insert_one(group)
        
        # Get creator details
        creator = db.users.find_one({"_id": ObjectId(current_user_id)})
        
        return jsonify({
            'message': 'Group created successfully',
            'group': {
                'id': str(result.inserted_id),
                'name': name,
                'created_by': str(current_user_id),
                'members': [{
                    'id': str(creator["_id"]),
                    'name': creator.get('name', ''),
                    'email': creator['email']
                }] if creator else []
            }
        }), 201
        
    except Exception as e:
        print("Create group error:", str(e))
        return jsonify({'error': 'Failed to create group', 'details': str(e)}), 500

@groups_bp.route('/<group_id>', methods=['GET'])
@token_required
def get_group_details(current_user_id, group_id):
    """Get group details"""
    try:
        db = get_db()
        
        # Find group and verify user is a member
        group = db.groups.find_one({
            "_id": ObjectId(group_id),
            "members": ObjectId(current_user_id)
        })
        
        if not group:
            return jsonify({'error': 'Group not found or access denied'}), 404
        
        # Get member details
        members = []
        for member_id in group.get("members", []):
            member = db.users.find_one({"_id": member_id})
            if member:
                members.append({
                    "id": str(member["_id"]),
                    "name": member.get("name", ""),
                    "email": member["email"]
                })
        
        return jsonify({
            'group': {
                'id': str(group["_id"]),
                'name': group["name"],
                'created_by': str(group["created_by"]),
                'members': members,
                'member_count': len(members)
            }
        }), 200
        
    except Exception as e:
        print("Get group details error:", str(e))
        return jsonify({'error': 'Failed to get group details', 'details': str(e)}), 500

@groups_bp.route('/<group_id>/members', methods=['POST'])
@token_required
def add_member_to_group(current_user_id, group_id):
    """Add member to group"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email'].strip().lower()
        
        db = get_db()
        
        # Verify group exists and user is a member
        group = db.groups.find_one({
            "_id": ObjectId(group_id),
            "members": ObjectId(current_user_id)
        })
        
        if not group:
            return jsonify({'error': 'Group not found or access denied'}), 404
        
        # Find user to add
        user_to_add = db.users.find_one({"email": email})
        if not user_to_add:
            return jsonify({'error': 'User not found'}), 404
        
        user_id_to_add = user_to_add["_id"]
        
        # Check if user is already a member
        if user_id_to_add in group.get("members", []):
            return jsonify({'error': 'User is already a member'}), 400
        
        # Add user to group
        db.groups.update_one(
            {"_id": ObjectId(group_id)},
            {"$push": {"members": user_id_to_add}}
        )
        
        return jsonify({
            'message': 'Member added successfully',
            'member': {
                'id': str(user_to_add["_id"]),
                'name': user_to_add.get('name', ''),
                'email': user_to_add['email']
            }
        }), 200
        
    except Exception as e:
        print("Add member error:", str(e))
        return jsonify({'error': 'Failed to add member', 'details': str(e)}), 500