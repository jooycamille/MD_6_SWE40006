import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the API module
jest.mock('./api.js', () => ({
  getTodos: jest.fn(() => Promise.resolve([])),
  addTodo: jest.fn((todo) => Promise.resolve({ 
    id: Date.now(), 
    text: todo.text, 
    status: 'To-Do' 
  })),
  updateTodo: jest.fn((id, todo) => Promise.resolve({ id, ...todo })),
  deleteTodo: jest.fn(() => Promise.resolve())
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console logs for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/loading todos/i)).toBeInTheDocument();
  });

  test('renders main interface after loading', async () => {
    render(<App />);
    
    // Wait for loading to complete - increased timeout for slower systems
    await waitFor(() => {
      expect(screen.getByText(/to-do list/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Check for main UI elements
    expect(screen.getByText(/organize your tasks efficiently/i)).toBeInTheDocument();
  }, 15000); // Set timeout per test

  test('renders input and button after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/to-do list/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByPlaceholderText(/enter a new task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  }, 15000);

  test('API is called on component mount', async () => {
    const { getTodos } = require('./api.js');
    
    render(<App />);
    
    // Wait a bit for useEffect to run
    await waitFor(() => {
      expect(getTodos).toHaveBeenCalled();
    }, { timeout: 5000 });
    
    expect(getTodos).toHaveBeenCalledTimes(1);
  }, 10000);
});