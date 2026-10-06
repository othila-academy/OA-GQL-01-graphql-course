import { describe, expect, it } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { shouldLogout } from './auth-errors';

describe('shouldLogout', () => {
  it('déconnecte quand le serveur répond UNAUTHENTICATED', () => {
    const error = new ApolloError({ graphQLErrors: [new GraphQLError('Authentification requise', { extensions: { code: 'UNAUTHENTICATED' } })] });
    expect(shouldLogout(error)).toBe(true);
  });

  it('ne déconnecte pas sur une panne réseau (serveur redémarré)', () => {
    const error = new ApolloError({ networkError: new TypeError('Failed to fetch') });
    expect(shouldLogout(error)).toBe(false);
  });
});
