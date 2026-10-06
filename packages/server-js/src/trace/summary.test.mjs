import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSummary } from './summary.js';

test('agrège les appels par champ, les plus fréquents en premier, avec la durée cumulée', () => {
  const calls = new Map([
    ['Query.events', { count: 1, ms: 0.2 }],
    ['Event.organizer', { count: 32, ms: 1.1 }],
    ['Event.participants', { count: 32, ms: 1.6 }]
  ]);
  const lines = formatSummary({ operationName: 'GetEvents', totalMs: 4.3, calls });
  assert.deepEqual(lines, [
    '[trace] GetEvents · 4.3 ms · 65 résolveurs',
    '  Event.participants   ×32   1.6 ms',
    '  Event.organizer      ×32   1.1 ms',
    '  Query.events         ×1    0.2 ms'
  ]);
});

test('ne dit rien quand aucun résolveur écrit à la main n’a été appelé', () => {
  assert.deepEqual(formatSummary({ operationName: 'IntrospectionQuery', totalMs: 1, calls: new Map() }), []);
});
