import React, { useState, useEffect } from 'react';
import './App.css';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api.js';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [status, setStatus] = useState('To-Do');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editHour, setEditHour] = useState('');
  const [editMinute, setEditMinute] = useState('');
  const [editStatus, setEditStatus] = useState('To-Do');

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Generate minute options (00, 15, 30, 45)
  const minuteOptions = ['00', '15', '30', '45'];

  // Helper function to combine hour and minute into time string
  const combineTime = (hour, minute) => {
    if (hour && minute) {
      return `${hour}:${minute}`;
    }
    return '';
  };

  // Helper function to split time string into hour and minute
  const splitTime = (timeString) => {
    if (timeString && timeString.includes(':')) {
      const [hour, minute] = timeString.split(':');
      return { hour, minute };
    }
    return { hour: '', minute: '' };
  };

  // Helper function to get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
  };

  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Load todos from backend when component mounts
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading todos from backend...');
      
      const todosData = await getTodos();
      console.log('Received todos:', todosData);
      
      // Transform backend data to match frontend expectations
      const transformedTodos = todosData.map(todo => ({
        id: todo.id,
        text: todo.text,
        status: todo.status || (todo.completed ? 'Finished' : 'To-Do'),
        createdAt: todo.createdAt, // Keep full datetime
        date: todo.createdAt ? todo.createdAt.split(' ')[0] : '', // Extract date part
        time: todo.createdAt ? todo.createdAt.split(' ')[1] || '' : '', // Extract time part
        completed: todo.completed || false
      }));
      
      setTodos(transformedTodos);
    } catch (err) {
      const errorMsg = 'Failed to load todos. Make sure backend is running on http://localhost:5000';
      setError(errorMsg);
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo with date and time
  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a todo item');
      return;
    }

    try {
      setError('');
      console.log('Adding new todo...');
      
      // Combine date and time or use current datetime
      let createdAt;
      const timeString = combineTime(selectedHour, selectedMinute);
      
      if (date && timeString) {
        createdAt = `${date} ${timeString}`;
      } else if (date) {
        createdAt = `${date} ${getCurrentTime()}`;
      } else if (timeString) {
        createdAt = `${getCurrentDate()} ${timeString}`;
      } else {
        createdAt = `${getCurrentDate()} ${getCurrentTime()}`;
      }
      
      const newTodoData = {
        text: inputValue.trim(),
        createdAt: createdAt,
        status: status
      };
      
      console.log('Sending todo data:', newTodoData);
      const addedTodo = await addTodo(newTodoData);
      console.log('Todo added:', addedTodo);
      
      // Transform the response to match frontend format
      const transformedTodo = {
        id: addedTodo.id,
        text: addedTodo.text,
        status: addedTodo.status || status,
        createdAt: addedTodo.createdAt,
        date: addedTodo.createdAt ? addedTodo.createdAt.split(' ')[0] : '',
        time: addedTodo.createdAt ? addedTodo.createdAt.split(' ')[1] || '' : '',
        completed: addedTodo.completed || false
      };
      
      setTodos(prevTodos => [transformedTodo, ...prevTodos]);
      
      // Reset form
      setInputValue('');
      setDate('');
      setSelectedHour('');
      setSelectedMinute('');
      setStatus('To-Do');
      
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  // Start editing a todo
  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDate(todo.date);
    
    // Split the time for editing
    const { hour, minute } = splitTime(todo.time);
    setEditHour(hour);
    setEditMinute(minute);
    setEditStatus(todo.status);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
    setEditDate('');
    setEditHour('');
    setEditMinute('');
    setEditStatus('To-Do');
  };

  // Save edited todo
  const handleEditSave = async (id) => {
    if (!editText.trim()) {
      setError('Todo text cannot be empty');
      return;
    }

    try {
      setError('');
      console.log('Saving edited todo:', id);

      // Combine edited date and time
      let createdAt;
      const editTimeString = combineTime(editHour, editMinute);
      
      if (editDate && editTimeString) {
        createdAt = `${editDate} ${editTimeString}`;
      } else if (editDate) {
        createdAt = `${editDate} ${getCurrentTime()}`;
      } else if (editTimeString) {
        createdAt = `${getCurrentDate()} ${editTimeString}`;
      } else {
        createdAt = `${getCurrentDate()} ${getCurrentTime()}`;
      }

      const updatedData = {
        text: editText.trim(),
        createdAt: createdAt,
        status: editStatus,
        completed: editStatus === 'Finished'
      };

      const updatedTodo = await updateTodo(id, updatedData);

      // Transform the response
      const transformedTodo = {
        id: updatedTodo.id,
        text: updatedTodo.text,
        status: updatedTodo.status || editStatus,
        createdAt: updatedTodo.createdAt,
        date: updatedTodo.createdAt ? updatedTodo.createdAt.split(' ')[0] : '',
        time: updatedTodo.createdAt ? updatedTodo.createdAt.split(' ')[1] || '' : '',
        completed: updatedTodo.completed || false
      };

      setTodos(prevTodos =>
        prevTodos.map(t => t.id === id ? transformedTodo : t)
      );

      // Reset edit state
      handleEditCancel();
      
      console.log('Todo updated successfully');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      setError('');
      console.log('Deleting todo:', id);
      
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      // Cancel editing if the deleted todo was being edited
      if (editingId === id) {
        handleEditCancel();
      }
      
      console.log('Todo deleted');
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  // Update todo status
  const handleStatusChange = async (id, newStatus) => {
    try {
      setError('');
      const todo = todos.find(t => t.id === id);
      
      if (!todo) return;
      
      console.log('Updating todo status:', id, newStatus);
      
      const updatedData = {
        text: todo.text,
        createdAt: todo.createdAt,
        status: newStatus,
        completed: newStatus === 'Finished'
      };
      
      const updatedTodo = await updateTodo(id, updatedData);
      
      // Transform the response
      const transformedTodo = {
        id: updatedTodo.id,
        text: updatedTodo.text,
        status: updatedTodo.status || newStatus,
        createdAt: updatedTodo.createdAt,
        date: updatedTodo.createdAt ? updatedTodo.createdAt.split(' ')[0] : '',
        time: updatedTodo.createdAt ? updatedTodo.createdAt.split(' ')[1] || '' : '',
        completed: updatedTodo.completed || false
      };
      
      setTodos(prevTodos => 
        prevTodos.map(t => t.id === id ? transformedTodo : t)
      );
      
      console.log('Todo status updated');
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  // Toggle completion (alternative to status change)
  const handleToggleComplete = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newStatus = todo.completed ? 'To-Do' : 'Finished';
    await handleStatusChange(id, newStatus);
  };

  // Group todos by status for Kanban display
  const groupedTodos = {
    'To-Do': todos.filter(todo => todo.status === 'To-Do'),
    'Doing': todos.filter(todo => todo.status === 'Doing'),
    'Finished': todos.filter(todo => todo.status === 'Finished')
  };

  if (loading) {
    return (
      <div className="App">
        <div className="app-header">
          <h1>Loading todos...</h1>
          <p>Connecting to backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>To-do List</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={loadTodos} style={{marginLeft: '10px', padding: '5px 10px'}}>
            Retry
          </button>
        </div>
      )}

      {/* Add Todo Form */}
      <form className="todo-input-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Enter a new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        
        <div className="datetime-group">
          <input
            type="date"
            className="todo-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            title="Select date"
          />
          
          <div className="time-selector-group">
            <select
              className="hour-select"
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              title="Select hour"
            >
              <option value="">Hour</option>
              {hourOptions.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            
            <span className="time-separator">:</span>
            
            <select
              className="minute-select"
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              title="Select minute"
            >
              <option value="">Min</option>
              {minuteOptions.map(minute => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
          </div>
        </div>
        
        <select
          className="todo-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="To-Do">To-Do</option>
          <option value="Doing">Doing</option>
          <option value="Finished">Finished</option>
        </select>
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>

      {/* Kanban Columns */}
      <div className="kanban-columns">
        {Object.entries(groupedTodos).map(([statusName, statusTodos]) => (
          <div key={statusName} className="column">
            <h2>{statusName} ({statusTodos.length})</h2>
            
            {statusTodos.length === 0 ? (
              <div className="no-todos">
                No tasks in {statusName}
              </div>
            ) : (
              statusTodos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  
                  {/* If editing this todo, show edit form */}
                  {editingId === todo.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        placeholder="Edit task text"
                      />
                      <div className="edit-datetime-group">
                        <input
                          type="date"
                          className="edit-date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                        <div className="edit-time-selector-group">
                          <select
                            className="edit-hour-select"
                            value={editHour}
                            onChange={(e) => setEditHour(e.target.value)}
                          >
                            <option value="">Hour</option>
                            {hourOptions.map(hour => (
                              <option key={hour} value={hour}>{hour}</option>
                            ))}
                          </select>
                          <span className="time-separator">:</span>
                          <select
                            className="edit-minute-select"
                            value={editMinute}
                            onChange={(e) => setEditMinute(e.target.value)}
                          >
                            <option value="">Min</option>
                            {minuteOptions.map(minute => (
                              <option key={minute} value={minute}>{minute}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <select
                        className="edit-status"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="To-Do">To-Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Finished">Finished</option>
                      </select>
                      <div className="edit-actions">
                        <button
                          className="save-button"
                          onClick={() => handleEditSave(todo.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-button"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal view */
                    <>
                      <div className="todo-checkbox">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todo.id)}
                        />
                      </div>
                      
                      <div className="todo-content">
                        <div className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                          {todo.text}
                        </div>
                        <div className="todo-datetime">
                          {todo.date || 'No date'} 
                          {todo.time && <span> at {todo.time}</span>}
                        </div>
                      </div>
                      
                      <div className="todo-controls">
                        {/* Status dropdown on top */}
                        <select
                          className={`status-select ${todo.status.toLowerCase().replace('-', '')}`}
                          value={todo.status}
                          onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                        >
                          <option value="To-Do">To-Do</option>
                          <option value="Doing">Doing</option>
                          <option value="Finished">Finished</option>
                        </select>
                        
                        {/* Action buttons below */}
                        <div className="todo-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEditStart(todo)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Footer with Connection Status */}
      <footer className="app-footer">
        <p>
          Total: {todos.length} tasks | 
          Backend: <span style={{color: error ? 'red' : 'green'}}>
            {error ? 'Disconnected' : 'Connected'}
          </span> | 
          API: http://localhost:5000
        </p>
      </footer>
    </div>
  );
}

export default App;