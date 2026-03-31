from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not set")

client = MongoClient(MONGO_URI)
db = client["easyxpense"]

@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

@app.route("/api/health")
def health():
    return {"status": "ok"}