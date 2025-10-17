import React, { useState, useEffect } from "react";
import "./App.css";
import { getTodos, addTodo, deleteTodo, updateTodo } from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("To-Do");

  // Load todos from Flask backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        console.error("❌ Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, []);

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      const newTodo = await addTodo({
        text: inputValue.trim(),
        createdAt: date || new Date().toISOString(),
        status,
      });
      setTodos([newTodo, ...todos]);
      setInputValue("");
      setDate("");
      setStatus("To-Do");
    } catch (error) {
      console.error("❌ Failed to add todo:", error);
    }
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("❌ Failed to delete todo:", error);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("❌ Failed to toggle complete:", error);
    }
  };

  // Update process/status (To-Do, Doing, Finished)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTodo(id, { status: newStatus });
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  // Group todos by status
  const grouped = {
    "To-Do": todos.filter((t) => t.status === "To-Do"),
    Doing: todos.filter((t) => t.status === "Doing"),
    Finished: todos.filter((t) => t.status === "Finished"),
  };

  return (
    <div className="App">
      {/* ===== HEADER ===== */}
      <header className="app-header">
        <h1>Todo List (Connected to Flask)</h1>
        <p>Organized by process: To-Do, Doing, Finished</p>
      </header>

      {/* ===== INPUT FORM ===== */}
      <main className="app-main">
        <form onSubmit={handleAddTodo} className="todo-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a new task"
            className="todo-input"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="todo-date"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="todo-status"
          >
            <option value="To-Do">To-Do</option>
            <option value="Doing">Doing</option>
            <option value="Finished">Finished</option>
          </select>
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        {/* ===== 3 STATUS COLUMNS ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {Object.keys(grouped).map((col) => (
            <div key={col} style={{ flex: "1", minWidth: "250px" }}>
              <h2
                style={{
                  textAlign: "center",
                  color:
                    col === "To-Do"
                      ? "#4a5568"
                      : col === "Doing"
                      ? "#d69e2e"
                      : "#38a169",
                  borderBottom: "2px solid #e2e8f0",
                  paddingBottom: "8px",
                }}
              >
                {col}
              </h2>
              <div className="todo-list">
                {grouped[col].length === 0 ? (
                  <p className="no-todos">No tasks in {col}</p>
                ) : (
                  grouped[col].map((todo) => (
                    <div
                      key={todo.id}
                      className={`todo-item ${
                        todo.completed ? "completed" : ""
                      }`}
                    >
                      <div className="todo-checkbox">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todo.id)}
                          className="checkbox"
                        />
                      </div>

                      <div className="todo-content">
                        <span
                          className={`todo-text ${
                            todo.completed ? "completed-text" : ""
                          }`}
                        >
                          {todo.text}
                        </span>
                        <span className="todo-date">
                          {todo.createdAt
                            ? new Date(todo.createdAt).toLocaleString()
                            : "No date"}
                        </span>
                      </div>

                      <div className="todo-actions">
                        <select
                          value={todo.status || "To-Do"}
                          onChange={(e) =>
                            handleStatusChange(todo.id, e.target.value)
                          }
                          className={`status-select ${
                            (todo.status || "To-Do").toLowerCase()
                          }`}
                        >
                          <option value="To-Do">To-Do</option>
                          <option value="Doing">Doing</option>
                          <option value="Finished">Finished</option>
                        </select>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="app-footer">
        <p>
          Total Tasks: {todos.length} | Completed:{" "}
          {todos.filter((t) => t.completed).length}
        </p>
      </footer>
    </div>
  );
}

export default App;
