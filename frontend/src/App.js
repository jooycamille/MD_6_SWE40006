import React, { useState, useEffect } from 'react';
import './App.css';

// =============================
// TodoItem Component
// -----------------------------
// Handles rendering of individual todo items,
// including editing, deleting, toggling completion,
// and date conversion for editing.
// =============================
function TodoItem({ todo, onDelete, onToggleComplete, onEdit }) {
  // State to handle whether the item is being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.createdAt);

  // Convert DD/MM/YYYY to YYYY-MM-DD for <input type="date">
  const convertToDateInput = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return ddmmyyyy;
  }

  // Convert YYYY-MM-DD from date input back to DD/MM/YYYY for display
  const convertFromDateInput = (yyyyMMdd) => {
    if (!yyyyMMdd) return '';
    const parts = yyyyMMdd.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return yyyyMMdd;
  }

  // Event handler for deleting a todo
  const handleDelete = () => {
    onDelete(todo.id);
  };

  // Event handler for toggling completion
  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  }; 

  // Save edited text/date
  const handleSave = () => {
    if (editText.trim()) {
      const formattedDate = convertFromDateInput(editDate);
      onEdit(todo.id, editText.trim(), formattedDate);
      setIsEditing(false);
    }
  }

  // Cancel edit mode and restore original values
  const handleCancel = () => {
    setEditText(todo.text);
    setEditDate(todo.createdAt);
    setIsEditing(false);
  }

  // Activate edit mode and convert displayed date for date input
  const handleEditClick = () => {
    setEditDate(convertToDateInput(todo.createdAt));
    setIsEditing(true);
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox Section */}
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="checkbox"
        />
      </div>

      {/* Main Content Section (Edit Mode vs Display Mode) */}
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
            <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
              {todo.text}
            </span>
            <span className="todo-date">{todo.createdAt}</span>
          </>
        )}
      </div>

      {/* Actions: Edit/Save/Delete */}
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="edit-button" onClick={handleEditClick}>
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

// =============================
// TodoList Component
// -----------------------------
// Responsible for rendering the full list of todos
// and showing the empty state if there are none.
// =============================
function TodoList({ todos, onDelete, onToggleComplete, onEdit }) {
  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <p className="no-todos">No tasks available</p>
      ) : (
        todos.map(todo => (
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

// =============================
// TodoInput Component
// -----------------------------
// Handles adding new todo items through
// a controlled input field and submit event.
// =============================
function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('');

  // Handle form submission (either button click or enter key)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a new task"
        className="todo-input"
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
}

// =============================
// Main App Component
// -----------------------------
// - Loads todos from localStorage on mount
// - Handles adding, deleting, editing, toggling
// - Persists changes to localStorage
// - Displays total outstanding and completed counts
// =============================
function App() {
  // Initialize todos from localStorage on first load
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Sync todos to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo function
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      createdAt: new Date().toLocaleDateString(),
      completed: false
    };
    setTodos([newTodo, ...todos]);
  };

  // Delete specific todo by ID
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle completion state of a todo
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Edit existing todo (text and date)
  const editTodo = (id, nextText, nextDate) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: nextText, createdAt: nextDate } : todo
    ));
  }

  // Calculate counters for footer display
  const completedCount = todos.filter(todo => todo.completed).length;
  const todoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="App">
      {/* =========================
          Header Section
         ========================= */}
      <header className="app-header">
        <h1>To-do List</h1>
      </header>

      {/* =========================
          Main Section
         ========================= */}
      <main className="app-main">
        <TodoInput onAddTodo={addTodo} />
        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onToggleComplete={toggleComplete}
          onEdit={editTodo}
        />
      </main>

      {/* =========================
          Footer Section
         ========================= */}
      <footer className="app-footer">
        <p>
          <strong>Outstanding Tasks: </strong>{todoCount} |{' '}
          <strong>Completed: </strong>{completedCount}
        </p>
      </footer>
    </div>
  );
}

export default App;
