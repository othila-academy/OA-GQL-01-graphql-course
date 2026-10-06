/**
 * Met en forme la synthèse d'une requête : une ligne par résolveur écrit à la main,
 * les plus appelés d'abord. Vide si aucun résolveur « maison » n'a tourné (introspection, erreur de validation).
 */
export function formatSummary({ operationName, totalMs, calls }) {
  if (calls.size === 0) return [];
  const rows = [...calls.entries()].sort((a, b) => b[1].count - a[1].count || b[1].ms - a[1].ms);
  const total = rows.reduce((sum, [, call]) => sum + call.count, 0);
  const width = Math.max(...rows.map(([name]) => name.length));
  const lines = [`[trace] ${operationName} · ${totalMs.toFixed(1)} ms · ${total} résolveur${total > 1 ? 's' : ''}`];
  for (const [name, { count, ms }] of rows) {
    lines.push(`  ${name.padEnd(width)}   ×${String(count).padEnd(4)} ${ms.toFixed(1)} ms`);
  }
  return lines;
}
