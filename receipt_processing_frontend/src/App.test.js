import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders home title', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const heading = screen.getByText(/Receipt & Expense Management/i);
  expect(heading).toBeInTheDocument();
});
