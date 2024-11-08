import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Todo from './index';
import '@testing-library/jest-dom';

test('renders the title of the to-do list', () => {
  render(<Todo />);
  const titleElement = screen.getByText(/Weekly to-do list/i);
  expect(titleElement).toBeInTheDocument();
});

test('displays the task list', () => {
    render(<Todo />);
    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
});

test('filters tasks based on search input', async () => {
    render(<Todo />);
    
    const searchInput = screen.getByPlaceholderText(/busca por texto.../i);
    
    fireEvent.change(searchInput, { target: { value: 'Resolver to-do bugs' } });
  
    await waitFor(
      () => {
        const filteredTask = screen.getByText(/Resolver to-do bugs/i);
        expect(filteredTask).toBeInTheDocument();
      },
      { timeout: 4000 } 
    );
  });