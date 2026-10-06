import { describe, expect, it } from 'vitest';
import { toInput } from './EventManager';

describe('toInput', () => {
  it('envoie une description vide pour effacer la description (null signifie « inchangé » côté serveur)', () => {
    const input = toInput({ title: ' Atelier ', description: '   ', category: 'TECH', start: '2026-12-01', end: '' });
    expect(input).toEqual({ title: 'Atelier', description: '', category: 'TECH', dateRange: { start: '2026-12-01', end: '2026-12-01' } });
  });
});
