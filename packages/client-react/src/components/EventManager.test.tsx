import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthProvider } from '../auth';
import { GET_EVENTS } from '../queries';
import EventManager from './EventManager';

const alice = { __typename: 'User', id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN' };
const mocks = [
  {
    request: { query: GET_EVENTS },
    result: {
      data: {
        events: [{
          __typename: 'Event', id: '101', title: 'Soirée jeux', description: null, category: 'SOCIAL',
          dateRange: { __typename: 'DateRange', start: '2026-10-20', end: '2026-10-20' }, organizer: alice, participants: [alice]
        }]
      }
    }
  }
];

test('liste les événements réels et désactive la création sans connexion', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <AuthProvider>
        <EventManager />
      </AuthProvider>
    </MockedProvider>
  );
  expect(await screen.findByText('Soirée jeux')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Nouvel événement/i })).toBeDisabled();
  for (const button of screen.getAllByTitle("Réservé à l'organisateur ou à un ADMIN")) expect(button).toBeDisabled();
});
