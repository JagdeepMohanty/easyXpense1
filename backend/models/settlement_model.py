from app.database import get_database
from bson import ObjectId
from datetime import datetime

class Settlement:
    def __init__(self):
        self.collection = get_database()['settlements']
    
    def create_settlement(self, payer_id, receiver_id, group_id, amount):
        settlement = {
            'payer_id': ObjectId(payer_id),
            'receiver_id': ObjectId(receiver_id),
            'group_id': ObjectId(group_id),
            'amount': amount,
            'created_at': datetime.utcnow()
        }
        result = self.collection.insert_one(settlement)
        return str(result.inserted_id)
    
    def get_user_settlements(self, user_id):
        settlements = self.collection.find({
            '$or': [
                {'payer_id': ObjectId(user_id)},
                {'receiver_id': ObjectId(user_id)}
            ]
        }).sort('created_at', -1)
        return list(settlements)
    
    def get_group_settlements(self, group_id):
        settlements = self.collection.find({
            'group_id': ObjectId(group_id)
        }).sort('created_at', -1)
        return list(settlements)
