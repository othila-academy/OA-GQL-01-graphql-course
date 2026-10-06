# Projet fil rouge – Plateforme d'événements (GraphQL)

Monorepo du cours GraphQL d'Othila Academy : deux serveurs **équivalents** (JavaScript avec Apollo Server, Python avec Graphene) et un client React + Apollo Client, autour d'un cas concret : la **gestion d'événements étudiants**.

## Organisation
- `packages/server-js/` – Node.js + Apollo Server 3 (schema-first)
- `packages/server-python/` – Flask + Graphene 3 (code-first)
- `packages/client-react/` – React + TypeScript + Apollo Client (Vite)
- `docs/` – Consignes de séance, gamification
- `scripts/` – Requêtes d'exemple et script de fumée (`smoke.mjs`)

## Une branche par séance, un tag par palier
```
session-1         Fondamentaux et premier schéma
session-2         Schéma avancé et relations
                  (session-2-resolvers-fixed : même contenu, resolvers modulaires)
session-3         Mutations, sécurité JWT, client React
                  s3-0-base → s3-1-crud → s3-2-jwt → s3-3-front → s3-4-directive
session-4         Performances et temps réel
                  s4-1-pagination → …
session-5-final   Projet final
```
Repartir d'un état sain : `git checkout s3-2-jwt`. Lire ce qu'un palier ajoute : `git diff s3-1-crud s3-2-jwt`. Revenir à la version « à trous » du client : `git checkout s3-0-base`.

## Démarrage rapide
Prérequis : Node.js 18+, npm 9+, Python 3.10+ (serveur Python seulement).

```bash
npm install          # serveur JS + client
npm run dev          # serveur JS sur http://localhost:4000/graphql et client sur http://localhost:3000
```

Serveur Python :
```bash
cd packages/server-python
python -m venv .venv && source .venv/bin/activate    # Windows : .venv\Scripts\activate
pip install -r requirements.txt
python app.py        # http://127.0.0.1:5000/graphql  (PORT=5001 python app.py si le port est pris)
```

Le client lit l'URL du serveur dans `VITE_GRAPHQL_URL` (voir `packages/client-react/.env.example`).

## Comptes de test (à partir du tag s3-2-jwt)
| Email | Rôle | Mot de passe |
|---|---|---|
| alice@example.com | ADMIN | password123 |
| bob@example.com | TEACHER | password123 |
| charlie@example.com | STUDENT | password123 |

Les données sont en mémoire : redémarrer un serveur les remet à zéro.

## Vérifier un serveur
```bash
npm run smoke                                      # serveur JS
npm run smoke -- http://127.0.0.1:5000/graphql     # serveur Python
```
Le script joue le scénario de la séance (lecture, CRUD, authentification, règles d'accès) et sort en erreur au premier écart.

## Explorer l'API
Apollo Sandbox (https://studio.apollographql.com/sandbox) pointé sur l'URL d'un des deux serveurs. Pour les opérations protégées, ajouter le header `Authorization: Bearer <token>` obtenu avec la mutation `login`.
