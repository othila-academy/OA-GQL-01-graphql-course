# Séance 3 – Mutations, sécurité et client

## Objectifs
- Écrire des mutations avec des types `input`, qui renvoient l'objet modifié.
- Authentifier avec un JWT lu dans le header `Authorization`, injecté dans le contexte, vérifié dans les résolveurs.
- Protéger le serveur : erreurs typées, masquage des erreurs internes, règles d'accès par rôle et par propriété.
- Brancher un vrai client (React + Apollo Client) sur l'API et l'adapter au contrat du schéma.

## Point de départ et paliers
| Tag | Contenu | Pour qui |
|---|---|---|
| `s3-0-base` | Schéma de la séance 2 en monorepo, client React à trous | Repartir d'un serveur sain |
| `s3-1-crud` | Mutations CRUD sur Event et User, erreurs typées | Comparer avec ses propres mutations |
| `s3-2-jwt` | login, me, rôles, règles d'accès, masquage | Se concentrer sur le front |
| `s3-3-front` | Client React branché : listes, détails, connexion, administration | Correction complète du front |
| `s3-4-directive` | Autorisation déclarative `@auth` (JS) et décorateur (Python) | Défi Security Guardian |

Lire un palier : `git diff s3-1-crud s3-2-jwt -- packages/server-js` (ou `packages/server-python`, ou `packages/client-react`).

## Comptes de test
| Email | Rôle | Mot de passe |
|---|---|---|
| alice@example.com | ADMIN | password123 |
| bob@example.com | TEACHER | password123 |
| charlie@example.com | STUDENT | password123 |

Dans Apollo Sandbox : exécuter `mutation { login(email: "alice@example.com", password: "password123") { token } }`, puis ajouter le header `Authorization: Bearer <token>` dans l'onglet Headers.

## Règles d'accès implémentées
| Opération | Règle |
|---|---|
| `login`, `createUser` | publiques ; le rôle demandé n'est pris en compte que si l'appelant est ADMIN (sinon STUDENT) |
| `me` | connecté |
| `createEvent` | connecté ; l'organisateur est l'utilisateur courant |
| `updateEvent`, `deleteEvent` | organisateur de l'événement ou ADMIN |
| `joinEvent`, `leaveEvent` | connecté ; agit pour soi |
| `updateUser` | soi-même ou ADMIN ; changer `role` exige ADMIN |
| `deleteUser` | ADMIN ; refusé si l'utilisateur organise encore des événements |
| queries de lecture | publiques |

Codes d'erreur : `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_USER_INPUT`. Tout le reste est masqué en `INTERNAL_SERVER_ERROR`.

## Étapes côté client (palier front)
1. `packages/client-react/.env.example` → `.env` avec l'URL de **votre** serveur.
2. Lancer `npm run dev`. L'onglet Événements échoue : lire l'erreur dans la console. « Cannot query field … » signifie que la requête demande un champ que votre schéma n'offre pas. Qui a raison ? Le schéma.
3. Adapter `src/queries.ts` à votre contrat, puis les composants (`EventsList`, `UsersList`) : afficher `dateRange`, `participants.length`, l'enum de catégorie.
4. Connexion : `LoginModal` appelle `login`, le token part dans le header grâce à `authLink` (`src/apollo-client.ts`).
5. Mutations depuis l'interface : `EventManager`, `UserManager`, `RegisterButton` utilisent `useMutation` avec `refetchQueries: 'active'`.
6. Convention des mises à jour partielles : dans un `UpdateEventInput` ou `UpdateUserInput`, un champ absent ou `null` signifie « inchangé » ; pour effacer une description, le client envoie une chaîne vide.

## Revue croisée : checklist en six points
1. Les objets passés aux mutations sont des types `input` dédiés, pas une liste d'arguments scalaires.
2. Chaque mutation renvoie l'objet modifié (ou un `Boolean` pour une suppression) et le client ne sélectionne que ce dont il a besoin.
3. L'accès est vérifié **côté serveur** (résolveur ou directive) ; désactiver un bouton côté client ne protège rien.
4. Les erreurs attendues portent un code dans `extensions` ; les erreurs internes sont masquées et journalisées.
5. Le mot de passe est hashé et n'apparaît dans aucun type du schéma.
6. Le token est lu dans le header `Authorization`, jamais passé en argument ou en variable d'une opération.

## Badges
- 🏅 **Mutation Master** : CRUD complet sur Event et User démontré dans Sandbox, avec un cas `NOT_FOUND` et un cas `BAD_USER_INPUT`.
- 🏅 **Security Guardian** : `login` fonctionnel, une mutation refusée en `UNAUTHENTICATED` et une en `FORBIDDEN`, plus **une** protection de la slide « Menaces et protections » (masquage des erreurs, limite de profondeur, pagination…) ou la directive `@auth` du palier 4.

## Palier 4 : autorisation déclarative (`s3-4-directive`)
Côté JS, la directive `@auth(requires: Role)` est déclarée dans le SDL et appliquée par un transformer `@graphql-tools` qui enveloppe le résolveur de chaque champ annoté (`src/directives/auth.js`). Le serveur reçoit un `schema` déjà transformé au lieu de `typeDefs` + `resolvers`.

Ce que la directive exprime : « connecté » et « tel rôle ». Ce qu'elle ne peut pas exprimer : « l'organisateur de **cet** événement », « **ce** profil est le mien ». Ces règles de propriété restent dans les résolveurs (`requireOwnerOrAdmin`).

Côté Python, graphene n'exécute pas les directives custom : le décorateur `@auth_required(role)` (`gql/decorators.py`) joue le même rôle sur les méthodes `resolve_*`. Même logique, deux syntaxes : c'est la différence schema-first / code-first vue en séance 2.

Lire le palier : `git diff s3-3-front s3-4-directive -- packages/server-js packages/server-python`.

## Défis
- Brancher la recherche de la barre de navigation sur `search` (union `User | Event`, fragments inline).
- Gérer les participants d'un événement depuis l'administration (liste, ajout, retrait).
- Réponse optimiste (`optimisticResponse`) sur l'inscription à un événement.
- Limiter la profondeur des requêtes (par exemple `graphql-depth-limit`) et le prouver avec une requête refusée.

## FAQ
- **CORS** : Apollo Server 3 autorise toutes les origines par défaut ; côté Flask c'est `flask-cors` qui le fait. Si le navigateur bloque, vérifier l'URL (port, chemin) avant de soupçonner CORS.
- **Token expiré ou forgé** : il est traité comme anonyme. `me` répond `null` au palier 2, puis `UNAUTHENTICATED` à partir du palier 4 (`@auth`), et le client vous déconnecte. Reconnectez-vous ; le token dure 2 h.
- **Python** : `pip install -r requirements.txt` dans un venv ; `flask-graphql` n'est plus utilisé. Port 5000 pris sur macOS : `PORT=5001 python app.py`.
- **« Cannot query field X on type Y »** : la requête du client ne correspond pas au schéma du serveur. Ouvrir le schéma dans Sandbox et adapter la requête.
