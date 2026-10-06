import type { ApolloCache } from '@apollo/client';

/**
 * Retire un événement du cache normalisé. La politique offsetLimitPagination fusionne les pages
 * dans une liste qu'elle ne raccourcit jamais : après une suppression, le dernier élément resterait
 * en double. Évincer l'objet suffit, Apollo ignore les références pendantes à la lecture.
 */
export function evictEvent(cache: ApolloCache<unknown>, id: string): void {
  cache.evict({ id: cache.identify({ __typename: 'Event', id }) });
  cache.gc();
}
