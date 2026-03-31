from pymongo import MongoClient
import os

client = None
db = None

def get_db():
    global client, db
    if db is None:
        uri = os.getenv("MONGO_URI")
        if not uri:
            raise Exception("MONGO_URI missing")

        client = MongoClient(uri)
        db = client["easyxpense"]

    return db