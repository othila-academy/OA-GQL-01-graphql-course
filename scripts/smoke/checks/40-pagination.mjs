import { assert, expectData, expectErrorCode } from '../runner.mjs';

export const badges = ['Performance Hacker'];

export const checks = {
  'events pagine avec limit et offset, sans recouvrement': async ({ gql }) => {
    const first = expectData(await gql('{ events(limit: 5, offset: 0) { id } eventsCount }'), 'page 1');
    const second = expectData(await gql('{ events(limit: 5, offset: 5) { id } }'), 'page 2');
    assert(first.events.length === 5 && second.events.length === 5, 'cinq éléments par page');
    const ids = new Set(first.events.map((e) => e.id));
    assert(!second.events.some((e) => ids.has(e.id)), 'pas de recouvrement entre les pages');
    assert(first.eventsCount >= 30, 'au moins trente événements au total');
  },

  'limit vaut 10 par défaut et la dernière page est plus courte': async ({ gql }) => {
    const data = expectData(await gql('{ events { id } eventsCount }'), 'défaut');
    assert(data.events.length === 10, 'dix éléments par défaut');
    const last = expectData(await gql(`{ events(limit: 10, offset: ${data.eventsCount - 3}) { id } }`), 'dernière page');
    assert(last.events.length === 3, 'trois éléments restants');
  },

  'limit hors bornes ou offset négatif : BAD_USER_INPUT': async ({ gql }) => {
    expectErrorCode(await gql('{ events(limit: 500) { id } }'), 'BAD_USER_INPUT', 'limit 500');
    expectErrorCode(await gql('{ events(limit: 0) { id } }'), 'BAD_USER_INPUT', 'limit 0');
    expectErrorCode(await gql('{ events(offset: -1) { id } }'), 'BAD_USER_INPUT', 'offset -1');
  }
};
