from app.database import get_database
from bson import ObjectId
import bcrypt
from datetime import datetime

class User:
    def __init__(self):
        self.collection = get_database()['users']
        self.collection.create_index('email', unique=True)
    
    def create_user(self, name, email, password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        result = self.collection.insert_one(user)
        return str(result.inserted_id)
    
    def find_by_email(self, email):
        return self.collection.find_one({'email': email})
    
    def find_by_id(self, user_id):
        return self.collection.find_one({'_id': ObjectId(user_id)})
    
    def verify_password(self, password, hashed_password):
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
