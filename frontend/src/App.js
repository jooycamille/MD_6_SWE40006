import React, { useState, useEffect } from 'react';
import './App.css';

// Todo Item Component
function TodoItem({ todo, onDelete, onToggleComplete }) {
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
            <button className="save-button" onClick={() => setIsEditing(false)}>
              Save
            </button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
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
function TodoList({ todos, onDelete, onToggleComplete }) {
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
  const [todos, setTodos] = useState([]);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

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
        <TodoList todos={todos} onDelete={deleteTodo} onToggleComplete={toggleComplete} />
      </main>
      
      <footer className="app-footer">
        <p><strong>Outstanding Tasks: </strong>{todoCount} | <strong>Completed: </strong>{completedCount}</p>
      </footer>
    </div>
  );
}

export default App;
