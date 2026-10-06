import { ApolloError } from 'apollo-server';

/** Erreur « ressource introuvable » avec le code NOT_FOUND dans extensions. */
export function notFound(type, id) {
  return new ApolloError(`${type} ${id} introuvable`, 'NOT_FOUND');
}
