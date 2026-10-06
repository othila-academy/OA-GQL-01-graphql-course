// Usage : npm run schema [-- url]     (défaut : http://localhost:4000/graphql)
// Affiche le schéma SDL d'un serveur GraphQL (obtenu par introspection) puis l'écart
// avec le contrat de référence contracts/schema.graphql.
// Enseignant : npm run schema -- <url> --write  régénère le contrat depuis le serveur de la correction.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildClientSchema, getIntrospectionQuery, lexicographicSortSchema, printSchema } from 'graphql';

const args = process.argv.slice(2);
const write = args.includes('--write');
const url = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:4000/graphql';
const contractPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'contracts', 'schema.graphql');

const response = await fetch(url, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query: getIntrospectionQuery() })
}).catch((error) => {
  console.error(`Serveur injoignable sur ${url} (${error.message})`);
  process.exit(1);
});
if (!response.ok) {
  console.error(`HTTP ${response.status} sur ${url}`);
  process.exit(1);
}
const { data, errors } = await response.json();
if (!data) {
  console.error('Introspection refusée :', JSON.stringify(errors));
  process.exit(1);
}

// Tri lexicographique pour une sortie stable, descriptions retirées : le contrat, ce sont les types et les champs.
const sdl = printSchema(lexicographicSortSchema(buildClientSchema(data)))
  .replace(/^[ \t]*"""(?:[^"]|"(?!""))*"""[ \t]*\n/gm, '')
  .trimEnd() + '\n';

if (write) {
  writeFileSync(contractPath, sdl);
  console.log(`Contrat écrit dans ${path.relative(process.cwd(), contractPath)}`);
  process.exit(0);
}

console.log(sdl);

if (!existsSync(contractPath)) process.exit(0);
const meaningful = (text) => text.split('\n').filter((line) => line.trim() !== '');
const mine = meaningful(sdl);
const reference = meaningful(readFileSync(contractPath, 'utf8'));
const mineSet = new Set(mine);
const referenceSet = new Set(reference);
const missing = reference.filter((line) => !mineSet.has(line));
const extra = mine.filter((line) => !referenceSet.has(line));

if (missing.length === 0 && extra.length === 0) {
  console.log('— Schéma identique au contrat (contracts/schema.graphql).');
} else {
  console.log('— Écart avec le contrat (contracts/schema.graphql) :');
  for (const line of missing) console.log(`  manque   ${line}`);
  for (const line of extra) console.log(`  en plus  ${line}`);
  process.exit(2);
}
