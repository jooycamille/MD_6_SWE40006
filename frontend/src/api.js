import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api/todos' ?? 'http://localhost:5001/api/todos';

// Optional: Add axios interceptors for debugging
axios.interceptors.request.use(request => {
  console.log('API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// GET all todos
export const getTodos = async () => {
  try {
    const res = await axios.get(API_BASE);
    console.log('📦 Fetched todos:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// ADD new todo
export const addTodo = async (todoData) => {
  try {
    console.log("Sending todoData:", todoData);
    
    const res = await axios.post(API_BASE, {
      text: todoData.text,
      createdAt: todoData.createdAt || todoData.date, // Handle both field names
      status: todoData.status || 'To-Do' // Default status
    });
    
    console.log("Todo added:", res.data);
    return res.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

// UPDATE todo
export const updateTodo = async (id, updatedFields) => {
  try {
    console.log(`Updating todo ${id}:`, updatedFields);
    
    const res = await axios.put(`${API_BASE}/${id}`, updatedFields);
    
    console.log("Todo updated:", res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// DELETE todo
export const deleteTodo = async (id) => {
  try {
    console.log(`Deleting todo ${id}`);
    
    await axios.delete(`${API_BASE}/${id}`);
    
    console.log("Todo deleted");
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};