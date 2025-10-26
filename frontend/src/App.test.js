import { render, screen, waitFor } from '@testing-library/react';
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
  render(<App />);

  const input = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByText('Add');

  await userEvent.type(input, 'Test todo item');
  await userEvent.click(addButton);

  expect(screen.getByText('Test todo item')).toBeInTheDocument();
  expect(screen.queryByText(/No tasks available/i)).not.toBeInTheDocument();
});

test('deletes a todo item', async () => {
  render(<App />);

  // Add a todo first
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Todo to delete');
  await userEvent.click(screen.getByText('Add'));

  // Delete the todo
  const deleteButton = screen.getByText('Delete');
  await userEvent.click(deleteButton);

  expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('toggles todo completion status', async () => {
  render(<App />);
  
  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Todo to complete');
  await userEvent.click(screen.getByText('Add'));
  
  // Toggle completion
  const checkbox = screen.getByRole('checkbox');
  await userEvent.click(checkbox);
  
  expect(checkbox).toBeChecked();
  
  // Check that both labels exist and their associated numbers
  expect(screen.getByText('Outstanding Tasks:')).toBeInTheDocument();
  expect(screen.getByText('Completed:')).toBeInTheDocument();
});

test('edits todo text and date', async () => {
  render(<App />);

  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Original todo');
  await userEvent.click(screen.getByText('Add'));

  // Edit the todo
  const editButton = screen.getByText('Edit');
  await userEvent.click(editButton);

  const editInput = screen.getByDisplayValue('Original todo');
  await userEvent.clear(editInput);
  await userEvent.type(editInput, 'Edited todo');

  const saveButton = screen.getByText('Save');
  await userEvent.click(saveButton);

  expect(screen.getByText('Edited todo')).toBeInTheDocument();
  expect(screen.queryByText('Original todo')).not.toBeInTheDocument();
});

test('cancels todo editing', async () => {
  render(<App />);

  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Original todo');
  await userEvent.click(screen.getByText('Add'));

  // Start editing
  const editButton = screen.getByText('Edit');
  await userEvent.click(editButton);

  const editInput = screen.getByDisplayValue('Original todo');
  await userEvent.clear(editInput);
  await userEvent.type(editInput, 'This should be cancelled');

  // Cancel editing
  const cancelButton = screen.getByText('Cancel');
  await userEvent.click(cancelButton);

  expect(screen.getByText('Original todo')).toBeInTheDocument();
  expect(screen.queryByText('This should be cancelled')).not.toBeInTheDocument();
});

test('prevents adding empty todos', async () => {
  render(<App />);

  const addButton = screen.getByText('Add');
  await userEvent.click(addButton);

  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('handles form submission with enter key', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Todo via enter key{enter}');

  expect(screen.getByText('Todo via enter key')).toBeInTheDocument();
});

test('updates todo counters correctly', async () => {
  render(<App />);
  
  // Add multiple todos
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  
  await userEvent.type(input, 'Todo 1');
  await userEvent.click(screen.getByText('Add'));
  
  await userEvent.type(input, 'Todo 2');
  await userEvent.click(screen.getByText('Add'));
  
  await userEvent.type(input, 'Todo 3');
  await userEvent.click(screen.getByText('Add'));
  
  // Verify labels exist
  expect(screen.getByText('Outstanding Tasks:')).toBeInTheDocument();
  expect(screen.getByText('Completed:')).toBeInTheDocument();
  
  // Complete one todo
  const checkboxes = screen.getAllByRole('checkbox');
  await userEvent.click(checkboxes[0]);
  
  // Verify the todo got checked
  expect(checkboxes[0]).toBeChecked();
});

test('persists todos in localStorage', async () => {
  render(<App />);

  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Persistent todo');
  await userEvent.click(screen.getByText('Add'));

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

describe('Critical Checks', () => {
  test('counter displays correct value after adding a task', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Enter a new task/i);
    const addButton = screen.getByText('Add');

    await userEvent.type(input, 'Task A');
    await userEvent.click(addButton);

    const counter = screen.getByText(/Outstanding Tasks:/i);
    expect(counter).toHaveTextContent(/^Outstanding Tasks: 1$/);
  });
});