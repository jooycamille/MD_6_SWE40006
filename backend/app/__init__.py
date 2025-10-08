from flask import Flask
from flask_cors import CORS
from .models import db
from .routes import todo_bp
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    app.register_blueprint(todo_bp)
    return app
