from app.database import get_database
from bson import ObjectId
from datetime import datetime

class Group:
    def __init__(self):
        self.collection = get_database()['groups']
    
    def create_group(self, name, creator_id):
        group = {
            'name': name,
            'created_by': ObjectId(creator_id),
            'members': [ObjectId(creator_id)],
            'created_at': datetime.utcnow()
        }
        result = self.collection.insert_one(group)
        return str(result.inserted_id)
    
    def get_user_groups(self, user_id):
        groups = self.collection.find({
            'members': ObjectId(user_id)
        })
        return list(groups)
    
    def get_group_by_id(self, group_id):
        return self.collection.find_one({'_id': ObjectId(group_id)})
    
    def is_member(self, group_id, user_id):
        group = self.collection.find_one({
            '_id': ObjectId(group_id),
            'members': ObjectId(user_id)
        })
        return group is not None
    
    def add_member(self, group_id, user_id):
        return self.collection.update_one(
            {'_id': ObjectId(group_id)},
            {'$addToSet': {'members': ObjectId(user_id)}}
        )
    
    def is_already_member(self, group_id, user_id):
        group = self.collection.find_one({
            '_id': ObjectId(group_id),
            'members': ObjectId(user_id)
        })
        return group is not None
