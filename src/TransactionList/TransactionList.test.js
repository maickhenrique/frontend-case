import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TransactionList from './index';
import '@testing-library/jest-dom';

test('renders total transactions correctly', () => {
  render(
    <MemoryRouter>
      <TransactionList />
    </MemoryRouter>
  );

  const totalElement = screen.getByText(/Total de transações:/i);
  expect(totalElement).toBeInTheDocument();
});
