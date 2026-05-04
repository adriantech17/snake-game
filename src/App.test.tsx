import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the snake game heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /snake game/i }),
  ).toBeInTheDocument();
});
