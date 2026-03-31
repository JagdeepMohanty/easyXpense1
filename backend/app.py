from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Render working"}

@app.route("/api/health")
def health():
    return {"status": "ok"}