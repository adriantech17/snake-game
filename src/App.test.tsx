import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Snake Game heading', () => {
  render(<App />);
  expect(screen.getByText(/snake game/i)).toBeInTheDocument();
});

