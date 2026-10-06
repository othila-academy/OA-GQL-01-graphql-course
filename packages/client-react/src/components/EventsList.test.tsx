import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthProvider } from '../auth';
import { GET_EVENTS } from '../queries';
import EventsList from './EventsList';

const alice = { __typename: 'User', id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN' };
const bob = { __typename: 'User', id: '2', name: 'Bob', email: 'bob@example.com', role: 'TEACHER' };

const mocks = [
  {
    request: { query: GET_EVENTS, variables: { limit: 6, offset: 0 } },
    result: {
      data: {
        events: [
          {
            __typename: 'Event',
            id: '101',
            title: 'Soirée jeux',
            description: 'Jeux de société et pizzas au foyer.',
            category: 'SOCIAL',
            dateRange: { __typename: 'DateRange', start: '2026-10-20', end: '2026-10-20' },
            organizer: alice,
            participants: [alice, bob]
          }
        ],
        eventsCount: 1
      }
    }
  }
];

test('affiche les événements du serveur avec la période et le nombre de participants', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <AuthProvider>
        <EventsList />
      </AuthProvider>
    </MockedProvider>
  );
  expect(await screen.findByText('Soirée jeux')).toBeInTheDocument();
  expect(screen.getByText('20/10/2026')).toBeInTheDocument();
  expect(screen.getByText('2 participants')).toBeInTheDocument();
  expect(screen.queryByText(/Charger plus/)).not.toBeInTheDocument();
});
