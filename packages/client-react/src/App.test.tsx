import { render, screen } from '@testing-library/react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import App from './App';

// Aucune réponse simulée : chaque opération échoue localement, sans réseau, sans bruit dans la console.
const offlineClient = new ApolloClient({ cache: new InMemoryCache(), link: new MockLink([], true, { showWarnings: false }) });

test("affiche l'en-tête de la plateforme", () => {
  render(<App client={offlineClient} />);
  expect(screen.getByRole('heading', { level: 1, name: /Event Platform/i })).toBeInTheDocument();
});
