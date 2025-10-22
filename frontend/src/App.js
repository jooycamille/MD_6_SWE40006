import React, { useState, useEffect } from 'react';
import './App.css';

// Todo Item Component
function TodoItem({ todo, onDelete, onToggleComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.createdAt);

  const convertToDateInput = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return ddmmyyyy;
  }

  const convertFromDateInput = (yyyyMMdd) => {
  if (!yyyyMMdd) return '';
  const parts = yyyyMMdd.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return yyyyMMdd;
}

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id);
  }; 

  const handleSave = () => {
    if (editText.trim()) {
      const formattedDate = convertFromDateInput(editDate);
      onEdit(todo.id, editText.trim(), formattedDate);
      setIsEditing(false);
    }
  }

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDate(todo.createdAt);
    setIsEditing(false);
  }

  const handleEditClick = () => {
    setEditDate(convertToDateInput(todo.createdAt));
    setIsEditing(true);
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
            <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
              {todo.text}
            </span>
            <span className="todo-date">{todo.createdAt}</span>
          </>
        )}
      </div>
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

// Todo List Component
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

// Todo Input Component
function TodoInput({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('');

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

// Main App Component
function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Save todos to localStorage whenever todos change
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

  // Delete todo function
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id, nextText, nextDate) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: nextText, createdAt: nextDate } : todo
    ));
  }

  // Calculate counts
  const completedCount = todos.filter(todo => todo.completed).length;
  const todoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="App">
      <header className="app-header">
        <h1>To-do List</h1>
      </header>

      <main className="app-main">
        <TodoInput onAddTodo={addTodo} />
        <TodoList todos={todos} onDelete={deleteTodo} onToggleComplete={toggleComplete} onEdit={editTodo} />
      </main>

      <footer className="app-footer">
        <p><strong>Outstanding Tasks: </strong>{todoCount} | <strong>Completed: </strong>{completedCount}</p>
      </footer>
    </div>
  );
}

export default App;
