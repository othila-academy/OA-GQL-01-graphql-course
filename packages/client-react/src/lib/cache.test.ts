import { describe, expect, it } from 'vitest';
import { createCache } from '../apollo-client';
import { evictEvent } from './cache';
import { EventsData, GET_EVENTS } from '../queries';

const alice = { __typename: 'User', id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN' as const };
const event = (id: string) => ({
  __typename: 'Event', id, title: `E${id}`, description: null, category: 'TECH' as const,
  dateRange: { __typename: 'DateRange', start: '2026-10-20', end: '2026-10-20' }, organizer: alice, participants: []
});
const variables = { limit: 50, offset: 0 };

describe('cache paginé et suppression', () => {
  it('ne garde pas de carte fantôme après la suppression d’un événement', () => {
    const cache = createCache();
    cache.writeQuery<EventsData>({ query: GET_EVENTS, variables, data: { events: [event('1'), event('2'), event('3')], eventsCount: 3 } });
    // Le serveur confirme la suppression de l'événement 3, puis la liste est refetchée (2 éléments).
    evictEvent(cache, '3');
    cache.writeQuery<EventsData>({ query: GET_EVENTS, variables, data: { events: [event('1'), event('2')], eventsCount: 2 } });
    const read = cache.readQuery<EventsData>({ query: GET_EVENTS, variables });
    expect(read?.events.map((e) => e.id)).toEqual(['1', '2']);
  });
});
