import { describe, expect, it } from 'vitest';
import { formatDateRange, initials } from './format';

describe('formatDateRange', () => {
  it('affiche une seule date quand début et fin sont identiques', () => {
    expect(formatDateRange({ start: '2026-10-06', end: '2026-10-06' })).toBe('06/10/2026');
  });

  it('affiche les deux bornes sinon', () => {
    expect(formatDateRange({ start: '2026-10-06', end: '2026-10-07' })).toBe('06/10/2026 → 07/10/2026');
  });

  it('rend la chaîne telle quelle si la date est invalide', () => {
    expect(formatDateRange({ start: 'bientôt', end: 'bientôt' })).toBe('bientôt');
  });
});

describe('initials', () => {
  it('prend au plus deux initiales en majuscules', () => {
    expect(initials('alice dupont martin')).toBe('AD');
    expect(initials('Bob')).toBe('B');
  });
});
