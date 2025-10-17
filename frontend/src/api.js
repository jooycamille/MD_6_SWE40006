import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api/todos';

// GET all todos
export const getTodos = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

// ADD new todo
export const addTodo = async (todoData) => {
  console.log("📤 Sending todoData:", todoData);  // 👈 thêm log để kiểm tra
  const res = await axios.post(API_BASE, {
    text: todoData.text,
    createdAt: todoData.createdAt,
    status: todoData.status
  });
  return res.data;
};

// UPDATE todo
export const updateTodo = async (id, updatedFields) => {
  const res = await axios.put(`${API_BASE}/${id}`, updatedFields);
  return res.data;
};

// DELETE todo
export const deleteTodo = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
