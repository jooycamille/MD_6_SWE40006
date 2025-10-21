import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Existing tests
test('renders todo app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/To-do List/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders add todo input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter a new task/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders initial empty state', () => {
  render(<App />);
  const emptyStateElement = screen.getByText(/No tasks available/i);
  expect(emptyStateElement).toBeInTheDocument();
});

test('renders todo counter', () => {
  render(<App />);
  const counterElement = screen.getByText(/Outstanding Tasks:/i);
  expect(counterElement).toBeInTheDocument();
});

test('adds a new todo item', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByText('Add');
  
  await user.type(input, 'Test todo item');
  await user.click(addButton);
  
  expect(screen.getByText('Test todo item')).toBeInTheDocument();
  expect(screen.queryByText(/No tasks available/i)).not.toBeInTheDocument();
});

test('deletes a todo item', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add a todo first
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Todo to delete');
  await user.click(screen.getByText('Add'));
  
  // Delete the todo
  const deleteButton = screen.getByText('Delete');
  await user.click(deleteButton);
  
  expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('toggles todo completion status', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Todo to complete');
  await user.click(screen.getByText('Add'));
  
  // Toggle completion
  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);
  
  expect(checkbox).toBeChecked();
  expect(screen.getByText(/Completed: 1/)).toBeInTheDocument();
  expect(screen.getByText(/Outstanding Tasks: 0/)).toBeInTheDocument();
});

test('edits todo text and date', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Original todo');
  await user.click(screen.getByText('Add'));
  
  // Edit the todo
  const editButton = screen.getByText('Edit');
  await user.click(editButton);
  
  const editInput = screen.getByDisplayValue('Original todo');
  await user.clear(editInput);
  await user.type(editInput, 'Edited todo');
  
  const saveButton = screen.getByText('Save');
  await user.click(saveButton);
  
  expect(screen.getByText('Edited todo')).toBeInTheDocument();
  expect(screen.queryByText('Original todo')).not.toBeInTheDocument();
});

test('cancels todo editing', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Original todo');
  await user.click(screen.getByText('Add'));
  
  // Start editing
  const editButton = screen.getByText('Edit');
  await user.click(editButton);
  
  const editInput = screen.getByDisplayValue('Original todo');
  await user.clear(editInput);
  await user.type(editInput, 'This should be cancelled');
  
  // Cancel editing
  const cancelButton = screen.getByText('Cancel');
  await user.click(cancelButton);
  
  expect(screen.getByText('Original todo')).toBeInTheDocument();
  expect(screen.queryByText('This should be cancelled')).not.toBeInTheDocument();
});

test('prevents adding empty todos', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const addButton = screen.getByText('Add');
  await user.click(addButton);
  
  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('handles form submission with enter key', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Todo via enter key{enter}');
  
  expect(screen.getByText('Todo via enter key')).toBeInTheDocument();
});

test('updates todo counters correctly', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add multiple todos
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  
  await user.type(input, 'Todo 1');
  await user.click(screen.getByText('Add'));
  
  await user.type(input, 'Todo 2');
  await user.click(screen.getByText('Add'));
  
  await user.type(input, 'Todo 3');
  await user.click(screen.getByText('Add'));
  
  expect(screen.getByText(/Outstanding Tasks: 3/)).toBeInTheDocument();
  expect(screen.getByText(/Completed: 0/)).toBeInTheDocument();
  
  // Complete one todo
  const checkboxes = screen.getAllByRole('checkbox');
  await user.click(checkboxes[0]);
  
  expect(screen.getByText(/Outstanding Tasks: 2/)).toBeInTheDocument();
  expect(screen.getByText(/Completed: 1/)).toBeInTheDocument();
});

test('persists todos in localStorage', async () => {
  const user = userEvent.setup();
  render(<App />);
  
  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await user.type(input, 'Persistent todo');
  await user.click(screen.getByText('Add'));
  
  // Check localStorage
  const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
  expect(savedTodos).toHaveLength(1);
  expect(savedTodos[0].text).toBe('Persistent todo');
});

test('loads todos from localStorage on mount', () => {
  // Pre-populate localStorage
  const mockTodos = [
    {
      id: 1,
      text: 'Loaded todo',
      createdAt: '12/01/2024',
      completed: false
    }
  ];
  localStorage.setItem('todos', JSON.stringify(mockTodos));
  
  render(<App />);
  
  expect(screen.getByText('Loaded todo')).toBeInTheDocument();
  expect(screen.queryByText(/No tasks available/i)).not.toBeInTheDocument();
});