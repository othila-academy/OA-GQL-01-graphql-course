import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { badgeReport } from './badges.mjs';

export async function gql(url, query, { variables, token } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ query, variables }) });
  // Apollo Server 3 répond 400 aux erreurs de validation : le corps JSON reste exploitable.
  if (!res.ok && res.status !== 400) throw new Error(`HTTP ${res.status} sur ${url}`);
  return res.json();
}

export function assert(condition, label) {
  if (!condition) throw new Error(label);
}

export function expectData(result, label) {
  if (result.errors?.length) {
    throw new Error(`${label} : erreurs inattendues ${JSON.stringify(result.errors)}`);
  }
  return result.data;
}

export function expectErrorCode(result, code, label) {
  const got = result.errors?.[0]?.extensions?.code;
  if (got !== code) {
    throw new Error(`${label} : code ${code} attendu, reçu ${got ?? 'aucune erreur'} (${JSON.stringify(result.errors ?? result.data)})`);
  }
}

export async function loginAs(gqlFn, email, password = 'password123') {
  const data = expectData(
    await gqlFn(
      'mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token user { id name role } } }',
      { variables: { email, password } }
    ),
    `login ${email}`
  );
  return data.login.token;
}

async function waitForServer(url, timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' })
      });
      if (res.ok) return;
    } catch {
      // serveur pas encore prêt
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Serveur injoignable sur ${url} après ${timeoutMs / 1000} s`);
}

export async function main() {
  const url = process.argv[2] ?? 'http://localhost:4000/graphql';
  console.log(`Smoke test contre ${url}`);
  await waitForServer(url);

  const checksDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'checks');
  const files = readdirSync(checksDir).filter((f) => f.endsWith('.mjs')).sort();
  const boundGql = (query, options) => gql(url, query, options);

  let failed = 0;
  const results = [];
  for (const file of files) {
    const { checks, badges = [] } = await import(path.join(checksDir, file));
    const state = {};
    let passed = 0;
    for (const [label, check] of Object.entries(checks)) {
      try {
        await check({ url, gql: boundGql, state });
        passed += 1;
        console.log(`  ✓ ${file} › ${label}`);
      } catch (error) {
        failed += 1;
        console.error(`  ✗ ${file} › ${label}\n    ${error.message}`);
      }
    }
    results.push({ badges, passed, total: Object.keys(checks).length });
  }

  console.log('');
  for (const line of badgeReport(results)) console.log(line);
  console.log(failed ? `\n${failed} check(s) en échec` : '\nTous les checks passent');
  process.exit(failed ? 1 : 0);
}
