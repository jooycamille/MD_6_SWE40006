import { render, screen } from '@testing-library/react';
import App from './App';

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
