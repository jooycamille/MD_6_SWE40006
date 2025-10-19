from flask import Blueprint, request, jsonify
from datetime import datetime
from .models import db, Todo

todo_bp = Blueprint('todo_bp', __name__)

# ------------------- GET -------------------
@todo_bp.route("/api/todos", methods=["GET"])
def get_todos():
    try:
        todos = Todo.query.all()
        return jsonify([
            {
                "id": t.id,
                "text": t.text,
                "createdAt": t.created_at,
                "completed": t.completed,
                "status": getattr(t, 'status', 'To-Do')  # Handle if status field doesn't exist
            } for t in todos
        ])
    except Exception as e:
        return jsonify({"error": "Failed to fetch todos", "details": str(e)}), 500

# ------------------- POST -------------------
@todo_bp.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    
    if not data or "text" not in data:
        return jsonify({"error": "Todo text is required"}), 400

    # Handle different text formats
    text_value = data["text"]
    if isinstance(text_value, dict):
        text_value = text_value.get("value", "")
    elif not isinstance(text_value, str):
        text_value = str(text_value)

    text_value = text_value.strip()
    if not text_value:
        return jsonify({"error": "Todo text cannot be empty"}), 400

    # Get other fields with defaults
    created_at = data.get("createdAt") or datetime.now().strftime("%Y-%m-%d %H:%M")
    status = data.get("status", "To-Do")

    try:
        new_todo = Todo(
            text=text_value,
            created_at=created_at,
            completed=False,
            status=status
        )  # Fixed: Added missing closing parenthesis
        
        db.session.add(new_todo)
        db.session.commit()
        
        return jsonify({
            "id": new_todo.id,
            "text": new_todo.text,
            "createdAt": new_todo.created_at,
            "completed": new_todo.completed,
            "status": new_todo.status  # Fixed: Added missing comma
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# ------------------- PUT -------------------
@todo_bp.route("/api/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        todo = Todo.query.get_or_404(id)
        
        # Update text if provided
        if "text" in data:
            text_value = data["text"]
            if isinstance(text_value, dict):
                text_value = text_value.get("value", "")
            elif not isinstance(text_value, str):
                text_value = str(text_value)
            
            text_value = text_value.strip()
            if not text_value:
                return jsonify({"error": "Todo text cannot be empty"}), 400
            todo.text = text_value

        # Update other fields if provided
        if "createdAt" in data:
            todo.created_at = data["createdAt"]
        if "completed" in data:
            todo.completed = data["completed"]
        if "status" in data:
            todo.status = data["status"]

        db.session.commit()
        
        return jsonify({
            "id": todo.id,
            "text": todo.text,
            "createdAt": todo.created_at,
            "completed": todo.completed,
            "status": getattr(todo, 'status', 'To-Do')
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database update failed", "details": str(e)}), 500

# ------------------- DELETE -------------------
@todo_bp.route("/api/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    try:
        todo = Todo.query.get_or_404(id)
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database deletion failed", "details": str(e)}), 500