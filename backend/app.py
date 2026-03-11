from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.health import health_bp
from routes.auth import auth_bp
from routes.friends import friends_bp
from routes.groups import groups_bp
from routes.expenses import expenses_bp
from routes.debts import debts_bp
from routes.settlements import settlements_bp
from routes.analytics import analytics_bp
from config.config import Config

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(health_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(friends_bp, url_prefix='/api/friends')
app.register_blueprint(groups_bp, url_prefix='/api/groups')
app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
app.register_blueprint(debts_bp, url_prefix='/api/debts')
app.register_blueprint(settlements_bp, url_prefix='/api/settlements')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

if __name__ == '__main__':
    app.run(debug=True, port=Config.PORT)
