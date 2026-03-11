from flask import Blueprint, jsonify
from models.user_model import User
from models.group_model import Group
from models.expense_model import Expense
from models.settlement_model import Settlement
from middleware.auth_middleware import token_required
from bson import ObjectId
from collections import defaultdict

debts_bp = Blueprint('debts', __name__)
user_model = User()
group_model = Group()
expense_model = Expense()
settlement_model = Settlement()

def calculate_debts_from_expenses(expenses, user_id=None, settlements=None):
    """
    Calculate debts from a list of expenses and subtract settlements.
    Returns a dictionary of balances: {user_id: {owes_to_user_id: amount}}
    """
    balances = defaultdict(lambda: defaultdict(float))
    
    # Add debts from expenses
    for expense in expenses:
        payer_id = str(expense['paid_by'])
        split_amount = expense['split_amount']
        
        for participant_id in expense['participants']:
            participant_id_str = str(participant_id)
            
            # Skip if participant is the payer
            if participant_id_str == payer_id:
                continue
            
            # Participant owes payer the split amount
            balances[participant_id_str][payer_id] += split_amount
    
    # Subtract settlements
    if settlements:
        for settlement in settlements:
            payer_id = str(settlement['payer_id'])
            receiver_id = str(settlement['receiver_id'])
            amount = settlement['amount']
            
            # Payer paid receiver, so reduce payer's debt to receiver
            if payer_id in balances and receiver_id in balances[payer_id]:
                balances[payer_id][receiver_id] -= amount
                if balances[payer_id][receiver_id] <= 0:
                    del balances[payer_id][receiver_id]
    
    return balances

def aggregate_user_debts(balances, user_id):
    """
    Aggregate debts for a specific user.
    Returns two lists: you_owe and you_are_owed
    """
    you_owe = {}
    you_are_owed = {}
    
    # Calculate what user owes to others
    if user_id in balances:
        for creditor_id, amount in balances[user_id].items():
            if creditor_id in you_are_owed:
                # Net the amounts
                net = amount - you_are_owed[creditor_id]
                if net > 0:
                    you_owe[creditor_id] = net
                    del you_are_owed[creditor_id]
                elif net < 0:
                    you_are_owed[creditor_id] = -net
                else:
                    del you_are_owed[creditor_id]
            else:
                you_owe[creditor_id] = amount
    
    # Calculate what others owe to user
    for debtor_id, creditors in balances.items():
        if user_id in creditors:
            amount = creditors[user_id]
            if debtor_id in you_owe:
                # Net the amounts
                net = you_owe[debtor_id] - amount
                if net > 0:
                    you_owe[debtor_id] = net
                elif net < 0:
                    you_are_owed[debtor_id] = -net
                    del you_owe[debtor_id]
                else:
                    del you_owe[debtor_id]
            else:
                you_are_owed[debtor_id] = amount
    
    return you_owe, you_are_owed

@debts_bp.route('', methods=['GET'])
@token_required
def get_user_debts(current_user):
    user_id = str(current_user['_id'])
    
    # Get all expenses where user is involved
    expenses = expense_model.get_user_expenses(user_id)
    
    # Get all settlements where user is involved
    settlements = settlement_model.get_user_settlements(user_id)
    
    # Calculate balances with settlements
    balances = calculate_debts_from_expenses(expenses, user_id, settlements)
    
    # Aggregate debts for the user
    you_owe, you_are_owed = aggregate_user_debts(balances, user_id)
    
    # Format response with user details
    you_owe_list = []
    for creditor_id, amount in you_owe.items():
        creditor = user_model.find_by_id(creditor_id)
        if creditor:
            you_owe_list.append({
                'user_id': creditor_id,
                'name': creditor['name'],
                'amount': round(amount, 2)
            })
    
    you_are_owed_list = []
    for debtor_id, amount in you_are_owed.items():
        debtor = user_model.find_by_id(debtor_id)
        if debtor:
            you_are_owed_list.append({
                'user_id': debtor_id,
                'name': debtor['name'],
                'amount': round(amount, 2)
            })
    
    return jsonify({
        'you_owe': you_owe_list,
        'you_are_owed': you_are_owed_list
    }), 200

@debts_bp.route('/groups/<group_id>', methods=['GET'])
@token_required
def get_group_debts(current_user, group_id):
    try:
        group = group_model.get_group_by_id(group_id)
    except:
        return jsonify({'message': 'Invalid group ID'}), 400
    
    if not group:
        return jsonify({'message': 'Group not found'}), 404
    
    user_id = str(current_user['_id'])
    if not group_model.is_member(group_id, user_id):
        return jsonify({'message': 'You are not a member of this group'}), 403
    
    # Get group expenses
    expenses = expense_model.get_group_expenses(group_id)
    
    # Get group settlements
    settlements = settlement_model.get_group_settlements(group_id)
    
    # Calculate balances with settlements
    balances = calculate_debts_from_expenses(expenses, None, settlements)
    
    # Format response as list of debts
    debts_list = []
    for debtor_id, creditors in balances.items():
        debtor = user_model.find_by_id(debtor_id)
        if not debtor:
            continue
        
        for creditor_id, amount in creditors.items():
            creditor = user_model.find_by_id(creditor_id)
            if not creditor:
                continue
            
            debts_list.append({
                'from': debtor['name'],
                'from_id': debtor_id,
                'to': creditor['name'],
                'to_id': creditor_id,
                'amount': round(amount, 2)
            })
    
    return jsonify(debts_list), 200
