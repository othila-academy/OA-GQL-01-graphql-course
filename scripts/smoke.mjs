// Usage : node scripts/smoke.mjs [url]   (défaut : http://localhost:4000/graphql)
// Joue tous les checks de scripts/smoke/checks/*.mjs contre un serveur déjà démarré.
import { main } from './smoke/runner.mjs';

await main();
