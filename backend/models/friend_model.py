from app.database import get_database
from bson import ObjectId
from datetime import datetime

class Friend:
    def __init__(self):
        db = get_database()
        self.requests_collection = db['friend_requests']
        self.friends_collection = db['friends']
    
    def create_request(self, sender_id, receiver_id):
        request = {
            'sender_id': ObjectId(sender_id),
            'receiver_id': ObjectId(receiver_id),
            'status': 'pending',
            'created_at': datetime.utcnow()
        }
        return self.requests_collection.insert_one(request)
    
    def get_request(self, request_id):
        return self.requests_collection.find_one({'_id': ObjectId(request_id)})
    
    def request_exists(self, sender_id, receiver_id):
        return self.requests_collection.find_one({
            'sender_id': ObjectId(sender_id),
            'receiver_id': ObjectId(receiver_id),
            'status': 'pending'
        }) is not None
    
    def accept_request(self, request_id):
        return self.requests_collection.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {'status': 'accepted'}}
        )
    
    def create_friendship(self, user1_id, user2_id):
        friendship = {
            'user1_id': ObjectId(user1_id),
            'user2_id': ObjectId(user2_id),
            'created_at': datetime.utcnow()
        }
        return self.friends_collection.insert_one(friendship)
    
    def are_friends(self, user1_id, user2_id):
        return self.friends_collection.find_one({
            '$or': [
                {'user1_id': ObjectId(user1_id), 'user2_id': ObjectId(user2_id)},
                {'user1_id': ObjectId(user2_id), 'user2_id': ObjectId(user1_id)}
            ]
        }) is not None
    
    def get_friends(self, user_id):
        friendships = self.friends_collection.find({
            '$or': [
                {'user1_id': ObjectId(user_id)},
                {'user2_id': ObjectId(user_id)}
            ]
        })
        
        friends = []
        for friendship in friendships:
            friend_id = friendship['user2_id'] if str(friendship['user1_id']) == user_id else friendship['user1_id']
            friends.append({'friend_id': str(friend_id)})
        
        return friends
    
    def get_pending_requests(self, user_id):
        return list(self.requests_collection.find({
            'receiver_id': ObjectId(user_id),
            'status': 'pending'
        }))
