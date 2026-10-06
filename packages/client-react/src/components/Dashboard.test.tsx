import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthProvider } from '../auth';
import { GET_EVENTS, GET_USERS } from '../queries';
import Dashboard from './Dashboard';

const alice = { __typename: 'User', id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN' };
const bob = { __typename: 'User', id: '2', name: 'Bob', email: 'bob@example.com', role: 'TEACHER' };
const event = (id: string, title: string, organizer: typeof alice, participants: (typeof alice)[]) => ({
  __typename: 'Event', id, title, description: null, category: 'TECH',
  dateRange: { __typename: 'DateRange', start: '2099-01-01', end: '2099-01-01' }, organizer, participants
});

const mocks = [
  { request: { query: GET_EVENTS, variables: { limit: 50, offset: 0 } }, result: { data: { events: [event('101', 'Soirée jeux', alice, [alice, bob]), event('102', 'Hackathon', bob, [bob])], eventsCount: 2 } } },
  { request: { query: GET_USERS }, result: { data: { users: [alice, bob] } } }
];

test('calcule les compteurs depuis les requêtes events et users', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MockedProvider>
  );
  expect(await screen.findByText('Derniers événements')).toBeInTheDocument();
  const values = screen.getAllByText((_, el) => el?.className === 'stat-value').map((el) => el.textContent);
  // Événements, Utilisateurs, À venir, Participations
  expect(values).toEqual(['2', '2', '2', '3']);
  // Alice et Bob organisent chacun un événement.
  expect(screen.getAllByText('1 événement organisé')).toHaveLength(2);
});
