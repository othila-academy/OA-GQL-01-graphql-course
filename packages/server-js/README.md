# Serveur JS – Apollo Server 3 (schema-first)

## Démarrage
```bash
npm install        # depuis la racine du monorepo
npm run start:server-js
```
Endpoint : http://localhost:4000/graphql (Apollo Server 3 répond aussi sur `/`).

## Structure
```
src/
  server.js                 # schéma exécutable + directive @auth, ApolloServer, contexte (JWT → user), formatError
  errors.js                 # notFound(), maskUnexpectedErrors()
  schema/typeDefs.js        # SDL : types, inputs, Query, Mutation
  data/mockData.js          # données de départ (mots de passe hashés au démarrage)
  data/userRepository.js    # lecture et écriture des utilisateurs
  data/eventRepository.js   # lecture et écriture des événements
  resolvers/query.js        # racine Query
  resolvers/mutation.js     # racine Mutation et règles d'accès
  resolvers/user.js         # champs relationnels de User
  resolvers/event.js        # champs relationnels de Event
  resolvers/node.js         # interface Node
  resolvers/searchResult.js # union SearchResult
  auth/jwt.js               # signature et lecture du token
  auth/guards.js            # requireAuth, requireRole, requireOwnerOrAdmin
  directives/auth.js        # transformer de la directive @auth (palier 4)
```

## Variables d'environnement
- `JWT_SECRET` : secret de signature (défaut de développement fourni).

## Vérifier
Depuis la racine : `npm run smoke`.
