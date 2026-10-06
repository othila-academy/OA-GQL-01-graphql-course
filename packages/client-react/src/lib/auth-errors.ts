import type { ApolloError } from '@apollo/client';

/** Seul un refus explicite du serveur déconnecte ; une panne réseau (serveur redémarré) ne doit pas faire perdre la session. */
export function shouldLogout(error: ApolloError): boolean {
  return error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
}
