from app.database import get_database
from bson import ObjectId
from datetime import datetime

class Expense:
    def __init__(self):
        self.collection = get_database()['expenses']
    
    def create_expense(self, group_id, description, amount, paid_by, participants):
        split_amount = round(amount / len(participants), 2)
        
        expense = {
            'group_id': ObjectId(group_id),
            'description': description,
            'amount': amount,
            'paid_by': ObjectId(paid_by),
            'participants': [ObjectId(p) for p in participants],
            'split_amount': split_amount,
            'created_at': datetime.utcnow()
        }
        result = self.collection.insert_one(expense)
        return str(result.inserted_id), split_amount
    
    def get_user_expenses(self, user_id):
        expenses = self.collection.find({
            '$or': [
                {'paid_by': ObjectId(user_id)},
                {'participants': ObjectId(user_id)}
            ]
        }).sort('created_at', -1)
        return list(expenses)
    
    def get_group_expenses(self, group_id):
        expenses = self.collection.find({
            'group_id': ObjectId(group_id)
        }).sort('created_at', -1)
        return list(expenses)
