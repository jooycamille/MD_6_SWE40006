import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Reset environment before each test to ensure no leftover data affects results
beforeEach(() => {
  localStorage.clear();
});

// ============================================
// BASIC RENDER TESTS
// These tests validate that essential UI elements
// (header, input field, empty state, counter) render correctly.
// ============================================
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

// ============================================
// CORE CRUD FUNCTIONALITY TESTS
// These ensure that adding, deleting, and toggling todos
// behave as expected and update the UI correctly.
// ============================================
test('adds a new todo item', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByText('Add');

  // Simulate typing and adding a todo
  await userEvent.type(input, 'Test todo item');
  await userEvent.click(addButton);

  // Check if new todo appears and empty state disappears
  expect(screen.getByText('Test todo item')).toBeInTheDocument();
  expect(screen.queryByText(/No tasks available/i)).not.toBeInTheDocument();
});

test('deletes a todo item', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a new task/i);

  // Add a todo
  await userEvent.type(input, 'Todo to delete');
  await userEvent.click(screen.getByText('Add'));

  // Delete the todo and verify it's removed
  const deleteButton = screen.getByText('Delete');
  await userEvent.click(deleteButton);

  expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('toggles todo completion status', async () => {
  render(<App />);
  
  // Add a new todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Todo to complete');
  await userEvent.click(screen.getByText('Add'));
  
  // Toggle its checkbox
  const checkbox = screen.getByRole('checkbox');
  await userEvent.click(checkbox);

  // Check if it’s marked as completed
  expect(checkbox).toBeChecked();
  expect(screen.getByText('Outstanding Tasks:')).toBeInTheDocument();
  expect(screen.getByText('Completed:')).toBeInTheDocument();
});

// ============================================
// EDITING TESTS
// These confirm that users can modify or cancel edits correctly.
// ============================================
test('edits todo text and date', async () => {
  render(<App />);

  // Add a todo to edit
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Original todo');
  await userEvent.click(screen.getByText('Add'));

  // Edit and save the todo
  const editButton = screen.getByText('Edit');
  await userEvent.click(editButton);
  const editInput = screen.getByDisplayValue('Original todo');
  await userEvent.clear(editInput);
  await userEvent.type(editInput, 'Edited todo');
  await userEvent.click(screen.getByText('Save'));

  // Validate update
  expect(screen.getByText('Edited todo')).toBeInTheDocument();
  expect(screen.queryByText('Original todo')).not.toBeInTheDocument();
});

test('cancels todo editing', async () => {
  render(<App />);

  // Add a todo
  const input = screen.getByPlaceholderText(/Enter a new task/i);
  await userEvent.type(input, 'Original todo');
  await userEvent.click(screen.getByText('Add'));

  // Start editing but cancel it
  const editButton = screen.getByText('Edit');
  await userEvent.click(editButton);
  const editInput = screen.getByDisplayValue('Original todo');
  await userEvent.clear(editInput);
  await userEvent.type(editInput, 'This should be cancelled');
  await userEvent.click(screen.getByText('Cancel'));

  // Validate original value remains
  expect(screen.getByText('Original todo')).toBeInTheDocument();
  expect(screen.queryByText('This should be cancelled')).not.toBeInTheDocument();
});

// ============================================
// VALIDATION & FORM INTERACTION TESTS
// ============================================
test('prevents adding empty todos', async () => {
  render(<App />);
  const addButton = screen.getByText('Add');
  await userEvent.click(addButton);
  expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
});

test('handles form submission with enter key', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a new task/i);

  // Press enter instead of clicking Add
  await userEvent.type(input, 'Todo via enter key{enter}');
  expect(screen.getByText('Todo via enter key')).toBeInTheDocument();
});

// ============================================
// COUNTER & STATE MANAGEMENT TESTS
// These verify that counters and local storage behave correctly.
// ============================================
test('updates todo counters correctly', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a new task/i);

  // Add multiple todos
  await userEvent.type(input, 'Todo 1');
  await userEvent.click(screen.getByText('Add'));
  await userEvent.type(input, 'Todo 2');
  await userEvent.click(screen.getByText('Add'));
  await userEvent.type(input, 'Todo 3');
  await userEvent.click(screen.getByText('Add'));

  // Verify counters exist
  expect(screen.getByText('Outstanding Tasks:')).toBeInTheDocument();
  expect(screen.getByText('Completed:')).toBeInTheDocument();

  // Complete one todo
  const checkboxes = screen.getAllByRole('checkbox');
  await userEvent.click(checkboxes[0]);
  expect(checkboxes[0]).toBeChecked();
});

// ============================================
// PERSISTENCE TESTS
// These ensure that localStorage works correctly for saving and loading tasks.
// ============================================
test('persists todos in localStorage', async () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a new task/i);

  // Add a persistent todo
  await userEvent.type(input, 'Persistent todo');
  await userEvent.click(screen.getByText('Add'));

  const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
  expect(savedTodos).toHaveLength(1);
  expect(savedTodos[0].text).toBe('Persistent todo');
});

test('loads todos from localStorage on mount', () => {
  const mockTodos = [{ id: 1, text: 'Loaded todo', createdAt: '12/01/2024', completed: false }];
  localStorage.setItem('todos', JSON.stringify(mockTodos));

  render(<App />);
  expect(screen.getByText('Loaded todo')).toBeInTheDocument();
  expect(screen.queryByText(/No tasks available/i)).not.toBeInTheDocument();
});

// ============================================
// GUARDRAIL TESTS
// This is a control test: if expected values are changed, the test will fail.
// Useful for pipeline regression checks.
// ============================================
describe('Guardrail Value Tests (using .each)', () => {
  test.each([
    ['Todo 1', 'Todo 1'],
    ['Todo 2', 'Todo 2'],
    ['Special Task', 'Special Task']
  ])('renders %s correctly', async (input, expected) => {
    render(<App />);
    const inputBox = screen.getByPlaceholderText(/Enter a new task/i);
    const addButton = screen.getByText('Add');

    await userEvent.type(inputBox, input);
    await userEvent.click(addButton);

    // If expected value changes, this will break → intentional guardrail
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
