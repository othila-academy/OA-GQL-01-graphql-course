import { render, screen } from '@testing-library/react';
import App from './App';

test("affiche l'en-tête de la plateforme", () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Event Platform/i })).toBeInTheDocument();
});
