/**
 * Tableau des badges à partir des résultats par module de checks.
 * Un badge est obtenu quand tous les checks des modules qui le déclarent passent.
 */
export function badgeReport(results) {
  const perBadge = new Map();
  for (const { badges = [], passed, total } of results) {
    for (const badge of badges) {
      const entry = perBadge.get(badge) ?? { passed: 0, total: 0 };
      entry.passed += passed;
      entry.total += total;
      perBadge.set(badge, entry);
    }
  }
  if (perBadge.size === 0) return [];
  const width = Math.max(...[...perBadge.keys()].map((name) => name.length));
  const lines = ['Badges'];
  for (const [badge, { passed, total }] of perBadge) {
    const missing = total - passed;
    const status = missing === 0 ? 'obtenu' : `${missing} check${missing > 1 ? 's' : ''} à corriger`;
    lines.push(`  🏅 ${badge.padEnd(width)}   ${`${passed}/${total}`.padEnd(5)} ${status}`);
  }
  return lines;
}
