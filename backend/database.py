from pymongo import MongoClient
import os

client = None
db = None

def get_db():
    global client, db
    if db is None:
        client = MongoClient(os.getenv("MONGO_URI"))
        db = client["easyxpense"]
    return db