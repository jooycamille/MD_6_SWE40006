from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.String, default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M"))
    completed = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default="To-Do")  # 🆕 NEW FIELD
    created_at = db.Column(db.String(20), nullable=False)
    completed = db.Column(db.Boolean, default=False)
