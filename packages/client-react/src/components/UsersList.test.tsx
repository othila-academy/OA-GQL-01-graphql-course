import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { AuthProvider } from '../auth';
import { GET_USERS } from '../queries';
import UsersList from './UsersList';

const mocks = [
  {
    request: { query: GET_USERS },
    result: {
      data: {
        users: [
          { __typename: 'User', id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN' },
          { __typename: 'User', id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'STUDENT' }
        ]
      }
    }
  }
];

test('affiche les utilisateurs du serveur avec leur email et leur rôle', async () => {
  render(
    <MockedProvider mocks={mocks}>
      <AuthProvider>
        <UsersList />
      </AuthProvider>
    </MockedProvider>
  );
  expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
  expect(screen.getByText('Étudiant')).toBeInTheDocument();
  expect(screen.getByText('2 membres')).toBeInTheDocument();
});
