from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load env
load_dotenv()

# Create app (GLOBAL — required for gunicorn)
app = Flask(__name__)
CORS(app)

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["easyxpense"]

# Health route (MANDATORY for Render)
@app.route("/")
def home():
    return {"message": "EasyXpense API running"}

@app.route("/api/health")
def health():
    return {"status": "ok"}

# Prevent local crash
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)