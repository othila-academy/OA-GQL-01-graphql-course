import { ApolloError } from 'apollo-server';

/** Erreur « ressource introuvable » avec le code NOT_FOUND dans extensions. */
export function notFound(type, id) {
  return new ApolloError(`${type} ${id} introuvable`, 'NOT_FOUND');
}

// Codes que l'on accepte de renvoyer au client. Les erreurs de syntaxe et de
// validation GraphQL en font partie : elles n'exposent rien du serveur.
const KNOWN_CODES = new Set([
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'BAD_USER_INPUT',
  'GRAPHQL_PARSE_FAILED',
  'GRAPHQL_VALIDATION_FAILED',
  'BAD_REQUEST'
]);

/**
 * formatError d'Apollo. Une erreur attendue est renvoyée réduite à l'essentiel : Apollo Server 3
 * ajoute sinon `extensions.exception.stacktrace` (chemins absolus du serveur) à chaque erreur.
 * Tout le reste est journalisé côté serveur et masqué.
 */
export function maskUnexpectedErrors(error) {
  const code = error.extensions?.code;
  if (KNOWN_CODES.has(code)) {
    return { message: error.message, locations: error.locations, path: error.path, extensions: { code } };
  }
  console.error('[graphql] erreur inattendue :', error.originalError ?? error);
  return { message: 'Internal server error', path: error.path, extensions: { code: 'INTERNAL_SERVER_ERROR' } };
}
