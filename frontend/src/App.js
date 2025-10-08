import React, { useState, useEffect } from "react";
import "./App.css";

// Todo Item Component
function TodoItem({ todo, onDelete, onToggleComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.createdAt);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="checkbox"
        />
      </div>
      <div className="todo-content">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-text-input"
              placeholder="Edit todo text..."
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="edit-date-input"
            />
          </div>
        ) : (
          <>
            <span
              className={`todo-text ${todo.completed ? "completed-text" : ""}`}
            >
              {todo.text}
            </span>
            <span className="todo-date">{todo.createdAt}</span>
          </>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              className="save-button"
              onClick={() => {
                onEdit(todo.id, editText, editDate);
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Todo List Component
function TodoList({ todos, onDelete, onToggleComplete, onEdit }) {
  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <p className="no-todos">No tasks available</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}

// Todo Input Component
function TodoInput({ onAddTodo, setError }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError("Todo text cannot be empty.");
      return;
    }

    onAddTodo(inputValue.trim());
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setError("");
        }}
        placeholder="Enter a new task"
        className="todo-input"
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
}

// Main App Component
function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  // Load todos from localStorage on component mount
  // useEffect(() => {
  //   const savedTodos = localStorage.getItem("todos");
  //   if (savedTodos) {
  //     setTodos(JSON.parse(savedTodos));
  //   }
  // }, []);

  // Save todos to localStorage whenever todos change
  // useEffect(() => {
  //   localStorage.setItem('todos', JSON.stringify(todos));
  // }, [todos]);

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, []);

  const addTodo = (text) => {
    if (!text.trim()) {
      setError("Todo text cannot be empty.");
      return;
    }

    const newTodo = {
      text: text.trim(),
      createdAt: new Date().toLocaleDateString(),
    };

    fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Failed to add todo");
          });
        }
        return res.json();
      })
      .then((added) => {
        setTodos((prev) => [added, ...prev]);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  //Delete todo function
  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => setTodos((prev) => prev.filter((todo) => todo.id !== id)))
      .catch((err) => console.error("Failed to delete todo:", err));
  };

  //Edit todo function
  const editTodo = (id, newText, newDate) => {
    if (!newText.trim()) {
      setError("Edited todo text cannot be empty.");
      return;
    }

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText.trim(), createdAt: newDate }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Failed to edit todo");
          });
        }
        return res.json();
      })
      .then(() => {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id
              ? { ...todo, text: newText.trim(), createdAt: newDate }
              : todo
          )
        );
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Toggle todo completion
  const toggleComplete = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    })
      .then(() => {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
      })
      .catch((err) => console.error("Failed to toggle todo:", err));
  };

  // Calculate counts
  const completedCount = todos.filter((todo) => todo.completed).length;
  const todoCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="App">
      <header className="app-header">
        <h1>To-do List</h1>
      </header>

      <main className="app-main">
        <TodoInput onAddTodo={addTodo} setError={setError} />
        {error && <div className="error-message">{error}</div>}
        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onToggleComplete={toggleComplete}
          onEdit={editTodo}
        />
      </main>

      <footer className="app-footer">
        <p>
          <strong>Outstanding Tasks: </strong>
          {todoCount} | <strong>Completed: </strong>
          {completedCount}
        </p>
      </footer>
    </div>
  );
}

export default App;
