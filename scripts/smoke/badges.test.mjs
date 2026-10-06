import { test } from 'node:test';
import assert from 'node:assert/strict';
import { badgeReport } from './badges.mjs';

test('regroupe les checks par badge et dit lesquels sont obtenus', () => {
  const results = [
    { badges: ['Query Explorer', 'Relation Builder'], passed: 4, total: 4 },
    { badges: ['Mutation Master'], passed: 7, total: 8 },
    { badges: ['Security Guardian'], passed: 12, total: 12 }
  ];
  assert.deepEqual(badgeReport(results), [
    'Badges',
    '  🏅 Query Explorer      4/4   obtenu',
    '  🏅 Relation Builder    4/4   obtenu',
    '  🏅 Mutation Master     7/8   1 check à corriger',
    '  🏅 Security Guardian   12/12 obtenu'
  ]);
});

test('ne dit rien si aucun module ne déclare de badge', () => {
  assert.deepEqual(badgeReport([{ badges: [], passed: 1, total: 1 }]), []);
});
