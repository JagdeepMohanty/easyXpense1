from pymongo import MongoClient
from config.config import Config

def get_database():
    if not Config.MONGO_URI:
        raise ValueError("MONGO_URI environment variable is not set")
    
    client = MongoClient(Config.MONGO_URI)
    return client['easyxpense']
