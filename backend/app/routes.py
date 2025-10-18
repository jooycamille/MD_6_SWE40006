from flask import Blueprint, request, jsonify
from datetime import datetime
from .models import db, Todo

todo_bp = Blueprint('todo_bp', __name__)

# ------------------- GET -------------------
@todo_bp.route("/api/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify([
        {
            "id": t.id,
            "text": t.text,
            "createdAt": t.created_at,
            "completed": t.completed,
            "status": t.status
        } for t in todos
    ])

# ------------------- POST -------------------
@todo_bp.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Todo text is required"}), 400

    text_value = data["text"]
    if isinstance(text_value, dict):
        text_value = text_value.get("value", "")
    elif not isinstance(text_value, str):
        text_value = str(text_value)

    text_value = text_value.strip()
    if not text_value:
        return jsonify({"error": "Todo text cannot be empty"}), 400

    created_at = data.get("createdAt") or datetime.now().strftime("%Y-%m-%d %H:%M")
    status = data.get("status", "To-Do")

    try:
        new_todo = Todo(
            text=text_value,
            created_at=created_at,
            completed=False,
            status=status
@todo_bp.route("/api/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{
        "id": t.id,
        "text": t.text,
        "createdAt": t.created_at,
        "completed": t.completed
    } for t in todos])

@todo_bp.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.get_json()

    if not data or "text" not in data or not data["text"].strip():
        return jsonify({"error": "Todo text is required"}), 400

    try:
        new_todo = Todo(
            text=data["text"].strip(),
            created_at=data.get("createdAt", ""),
            completed=False
        )
        db.session.add(new_todo)
        db.session.commit()
        return jsonify({
            "id": new_todo.id,
            "text": new_todo.text,
            "createdAt": new_todo.created_at,
            "completed": new_todo.completed,
            "status": new_todo.status
            "completed": new_todo.completed
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# ------------------- PUT -------------------
@todo_bp.route("/api/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    data = request.get_json()
    todo = Todo.query.get_or_404(id)

    if "text" in data:
        text_value = data["text"]
        if isinstance(text_value, dict):
            text_value = text_value.get("value", "")
        elif not isinstance(text_value, str):
            text_value = str(text_value)
        text_value = text_value.strip()
        todo.text = text_value

    if "createdAt" in data:
        todo.created_at = data["createdAt"]
    if "completed" in data:
        todo.completed = data["completed"]
    if "status" in data:
        todo.status = data["status"]

    try:
@todo_bp.route("/api/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        todo = Todo.query.get_or_404(id)
        if "text" in data:
            if not data["text"].strip():
                return jsonify({"error": "Todo text cannot be empty"}), 400
            todo.text = data["text"].strip()
        if "createdAt" in data:
            todo.created_at = data["createdAt"]
        if "completed" in data:
            todo.completed = data["completed"]

        db.session.commit()
        return jsonify({
            "id": todo.id,
            "text": todo.text,
            "createdAt": todo.created_at,
            "completed": todo.completed,
            "status": todo.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database update failed", "details": str(e)}), 500

# ------------------- DELETE -------------------
@todo_bp.route("/api/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    try:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database deletion failed", "details": str(e)}), 500
            "completed": todo.completed
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

@todo_bp.route("/api/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted"})
