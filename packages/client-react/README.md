# Client React – React 19 + Apollo Client 3 + Vite

Interface de la plateforme d'événements, branchée sur l'un des deux serveurs GraphQL du cours. Cette branche contient la **correction** ; la version à trous (données factices et TODO) est au tag `s3-0-base`.

## Démarrage
```bash
cp .env.example .env         # VITE_GRAPHQL_URL = URL de votre serveur
npm install                  # depuis la racine du monorepo
npm run start:client         # http://localhost:3000  (ou npm run dev pour serveur JS + client)
```
Comptes de test : alice@example.com (ADMIN), bob@example.com (TEACHER), charlie@example.com (STUDENT), mot de passe `password123`.

## Structure
```
src/
  apollo-client.ts            # ApolloClient : lien HTTP, lien d'authentification (Bearer), cache paginé
  auth-storage.ts             # token dans localStorage (lecture/écriture protégées)
  auth.tsx                    # AuthProvider / useAuth : utilisateur courant via la query me
  queries.ts                  # fragments, queries, mutations et types TypeScript alignés sur le schéma
  lib/format.ts               # dates YYYY-MM-DD, initiales, libellés des enums
  lib/cache.ts                # éviction d'un événement supprimé du cache paginé
  lib/auth-errors.ts          # quand une erreur sur `me` doit déconnecter
  components/Navigation.tsx   # onglets, bouton Connexion / Déconnexion
  components/LoginModal.tsx   # formulaire de connexion (mutation login)
  components/EventsList.tsx   # liste paginée (useQuery + fetchMore) et détails
  components/EventDetails.tsx # participants réels, inscription / désinscription
  components/RegisterButton.tsx
  components/UsersList.tsx    # annuaire et profil (UserDetails)
  components/EventManager.tsx # administration : CRUD événements (useMutation)
  components/UserManager.tsx  # administration : CRUD utilisateurs
  components/Dashboard.tsx    # compteurs calculés depuis events et users
  components/Modal.tsx
```

## Ce que montre chaque palier
- `s3-3-front` : `useQuery` dans les listes, `useMutation` dans l'administration, token envoyé par `authLink`, adaptation des composants au contrat du schéma (`dateRange`, `participants.length`, enum de catégorie).
- `s4-1-pagination` : `offsetLimitPagination` sur `Query.events`, bouton « Charger plus », éviction du cache à la suppression.

## Scripts
```bash
npm run dev       # Vite en mode développement
npm run build     # tsc puis vite build (dossier build/)
npm run preview   # prévisualisation du build
npm test          # Vitest, une seule passe
```

## Le serveur n'est pas celui de la correction ?
C'est le cas normal : votre schéma diffère. Ouvrez-le dans Apollo Sandbox, adaptez `src/queries.ts` à **votre** contrat, puis les composants. Une erreur « Cannot query field X on type Y » signifie que la requête demande un champ que votre serveur n'offre pas.

## Défis
- Brancher la barre de recherche sur la query `search` (union `User | Event`).
- Gérer les participants d'un événement depuis l'administration.
- Réponse optimiste (`optimisticResponse`) à l'inscription.
- Pagination de `users`.
