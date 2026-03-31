from flask import Blueprint, request, jsonify
from backend.jwt_utils import token_required
from backend.database import get_db
from bson import ObjectId
import datetime

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/', methods=['GET'])
@token_required
def get_expenses(current_user_id):
    """Get user's expenses"""
    try:
        db = get_db()
        
        # Find expenses where user is involved (paid or participant)
        expenses = list(db.expenses.find({
            "$or": [
                {"paid_by": ObjectId(current_user_id)},
                {"participants": ObjectId(current_user_id)}
            ]
        }))
        
        expense_list = []
        for expense in expenses:
            # Get group details
            group = db.groups.find_one({"_id": expense["group_id"]})
            
            # Get payer details
            payer = db.users.find_one({"_id": expense["paid_by"]})
            
            # Get participant details
            participants = []
            for participant_id in expense.get("participants", []):
                participant = db.users.find_one({"_id": participant_id})
                if participant:
                    participants.append({
                        "id": str(participant["_id"]),
                        "name": participant.get("name", ""),
                        "email": participant["email"]
                    })
            
            expense_list.append({
                "id": str(expense["_id"]),
                "description": expense["description"],
                "amount": expense["amount"],
                "group": {
                    "id": str(group["_id"]),
                    "name": group["name"]
                } if group else None,
                "paid_by": {
                    "id": str(payer["_id"]),
                    "name": payer.get("name", ""),
                    "email": payer["email"]
                } if payer else None,
                "participants": participants,
                "split_amount": expense["amount"] / len(participants) if participants else 0,
                "created_at": expense.get("created_at")
            })
        
        return jsonify({
            'expenses': expense_list,
            'count': len(expense_list)
        }), 200
        
    except Exception as e:
        print("Get expenses error:", str(e))
        return jsonify({'error': 'Failed to get expenses', 'details': str(e)}), 500

@expenses_bp.route('/', methods=['POST'])
@token_required
def create_expense(current_user_id):
    """Create new expense"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['description', 'amount', 'group_id', 'participants']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        description = data['description'].strip()
        amount = float(data['amount'])
        group_id = data['group_id']
        participant_ids = data['participants']
        paid_by = data.get('paid_by', current_user_id)
        
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
        
        if not description:
            return jsonify({'error': 'Description cannot be empty'}), 400
        
        if not participant_ids or len(participant_ids) == 0:
            return jsonify({'error': 'At least one participant is required'}), 400
        
        db = get_db()
        
        # Verify group exists and user is a member
        group = db.groups.find_one({
            "_id": ObjectId(group_id),
            "members": ObjectId(current_user_id)
        })
        
        if not group:
            return jsonify({'error': 'Group not found or access denied'}), 404
        
        # Convert participant IDs to ObjectIds and verify they're group members
        participant_object_ids = []
        for participant_id in participant_ids:
            participant_oid = ObjectId(participant_id)
            if participant_oid not in group.get("members", []):
                return jsonify({'error': f'Participant {participant_id} is not a group member'}), 400
            participant_object_ids.append(participant_oid)
        
        # Verify payer is a group member
        if ObjectId(paid_by) not in group.get("members", []):
            return jsonify({'error': 'Payer must be a group member'}), 400
        
        # Create expense
        expense = {
            "description": description,
            "amount": amount,
            "group_id": ObjectId(group_id),
            "paid_by": ObjectId(paid_by),
            "participants": participant_object_ids,
            "created_at": datetime.datetime.utcnow()
        }
        
        result = db.expenses.insert_one(expense)
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': {
                'id': str(result.inserted_id),
                'description': description,
                'amount': amount,
                'split_amount': amount / len(participant_object_ids),
                'group_id': group_id,
                'paid_by': paid_by,
                'participants': participant_ids
            }
        }), 201
        
    except ValueError as e:
        return jsonify({'error': 'Invalid amount format'}), 400
    except Exception as e:
        print("Create expense error:", str(e))
        return jsonify({'error': 'Failed to create expense', 'details': str(e)}), 500

@expenses_bp.route('/groups/<group_id>', methods=['GET'])
@token_required
def get_group_expenses(current_user_id, group_id):
    """Get expenses for a specific group"""
    try:
        db = get_db()
        
        # Verify group exists and user is a member
        group = db.groups.find_one({
            "_id": ObjectId(group_id),
            "members": ObjectId(current_user_id)
        })
        
        if not group:
            return jsonify({'error': 'Group not found or access denied'}), 404
        
        # Find expenses for this group
        expenses = list(db.expenses.find({"group_id": ObjectId(group_id)}))
        
        expense_list = []
        for expense in expenses:
            # Get payer details
            payer = db.users.find_one({"_id": expense["paid_by"]})
            
            # Get participant details
            participants = []
            for participant_id in expense.get("participants", []):
                participant = db.users.find_one({"_id": participant_id})
                if participant:
                    participants.append({
                        "id": str(participant["_id"]),
                        "name": participant.get("name", ""),
                        "email": participant["email"]
                    })
            
            expense_list.append({
                "id": str(expense["_id"]),
                "description": expense["description"],
                "amount": expense["amount"],
                "paid_by": {
                    "id": str(payer["_id"]),
                    "name": payer.get("name", ""),
                    "email": payer["email"]
                } if payer else None,
                "participants": participants,
                "split_amount": expense["amount"] / len(participants) if participants else 0,
                "created_at": expense.get("created_at")
            })
        
        return jsonify({
            'group': {
                'id': str(group["_id"]),
                'name': group["name"]
            },
            'expenses': expense_list,
            'count': len(expense_list)
        }), 200
        
    except Exception as e:
        print("Get group expenses error:", str(e))
        return jsonify({'error': 'Failed to get group expenses', 'details': str(e)}), 500