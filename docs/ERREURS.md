# Catalogue des erreurs rencontrées dans le cours

Une erreur GraphQL est une information, pas une panne. Chaque entrée dit **qui a tort** (le client qui demande, ou le serveur qui répond), pourquoi, et comment corriger. Les messages sont ceux d'Apollo Server et de graphql-core, à quelques mots près.

## Erreurs de validation : la requête ne respecte pas le schéma

### `Cannot query field "location" on type "Event".`
- **Qui a tort** : le client. Le champ n'existe pas dans le schéma du serveur.
- **Pourquoi** : la requête a été écrite pour un autre contrat (la maquette, un autre serveur).
- **Correction** : ouvrir le schéma dans Apollo Sandbox et adapter la requête. Le contrat ne se négocie pas depuis le client.
- **Palier** : `s3-3-front`, premier branchement du client.

### `Variable "$input" of required type "CreateEventInput!" was not provided.`
- **Qui a tort** : le client. La requête déclare une variable que l'appel n'envoie pas.
- **Correction** : vérifier l'objet `variables` (onglet Variables dans Sandbox, option `variables` d'Apollo Client).

### `Field "CreateEventInput.organizerId" is not defined by type "CreateEventInput".`
- **Qui a tort** : le client, mais à cause d'un contrat qui a changé : au palier 2, l'organisateur devient l'utilisateur connecté.
- **Correction** : retirer `organizerId` de l'input et envoyer un token. Lire `git diff s3-1-crud s3-2-jwt -- packages/server-js/src/schema`.

### `Unknown argument "limit" on field "Query.events".`
- **Qui a tort** : le client interroge un serveur qui n'a pas encore la pagination.
- **Correction** : passer au palier `s4-1-pagination` côté serveur, ou retirer l'argument.

## Erreurs d'exécution : la requête est valide, le serveur refuse

### `extensions.code = UNAUTHENTICATED` — « Authentification requise » ou « Identifiants invalides »
- **Qui a tort** : le client n'a pas envoyé de token, ou un token expiré (2 h), ou de mauvais identifiants.
- **Correction** : `mutation { login(email: "alice@example.com", password: "password123") { token } }`, puis header `Authorization: Bearer <token>`. Dans le client React, se reconnecter.

### `extensions.code = FORBIDDEN` — « Seul l'organisateur ou un ADMIN peut modifier cet événement »
- **Qui a tort** : personne, c'est une règle d'accès qui fonctionne. L'utilisateur connecté n'a pas le droit.
- **Correction** : se connecter avec le bon compte, ou comprendre pourquoi la règle existe (table des règles dans `SEANCE_3.md`).

### `extensions.code = NOT_FOUND` — « Event 999 introuvable »
- **Qui a tort** : le client demande une ressource qui n'existe pas (ou plus : les données sont en mémoire, un redémarrage les remet à zéro).
- **Correction** : relire `{ events { id } }` avant de viser un id.

### `extensions.code = BAD_USER_INPUT` — « dateRange.end doit être postérieure ou égale à dateRange.start », « Cet email est déjà utilisé », « limit doit être compris entre 1 et 50 »
- **Qui a tort** : le client envoie une valeur que le serveur refuse par règle métier.
- **Pourquoi** : la validation GraphQL vérifie les types, pas le sens. Ces règles vivent dans les résolveurs.
- **Correction** : corriger la valeur. Côté serveur, c'est le modèle à suivre pour vos propres règles.

### `extensions.code = INTERNAL_SERVER_ERROR` — « Internal server error »
- **Qui a tort** : le serveur a planté dans un résolveur et a masqué le détail, comme il doit le faire (slide « Menaces et protections »).
- **Correction** : le vrai message est dans le terminal du serveur, jamais dans la réponse. Le lire, corriger le résolveur.

## Erreurs côté serveur : le résolveur ne respecte pas le schéma

### `Cannot return null for non-nullable field Event.organizer.`
- **Qui a tort** : le serveur. Le schéma promet `User!` et le résolveur a renvoyé `null` (utilisateur introuvable, mauvais identifiant de liaison).
- **Correction** : soit corriger les données, soit assumer la nullabilité dans le schéma (`User` sans `!`). La nullabilité est une promesse, pas une décoration.

### `Expected Iterable, but did not find one for field "Query.events".`
- **Qui a tort** : le serveur. Le schéma promet une liste et le résolveur a renvoyé un objet ou `undefined`.
- **Correction** : renvoyer un tableau (ou une liste Python), même vide.

### `Abstract type "SearchResult" must resolve to an Object type at runtime…`
- **Qui a tort** : le serveur. Une union ou une interface sans fonction de résolution de type.
- **Correction** : `__resolveType` côté Apollo, `resolve_type` côté graphene (voir `resolvers/searchResult.js`, `gql/unions.py`).

## Erreurs qui n'ont rien à voir avec GraphQL

### Dans le navigateur : `Failed to fetch`, `NetworkError`, ou un message CORS
- **Qui a tort** : dans neuf cas sur dix, l'URL (port, chemin) ou un serveur éteint. Le CORS est ouvert par défaut sur Apollo Server 3 et par `flask-cors` côté Python.
- **Correction** : ouvrir l'URL du serveur dans Sandbox d'abord. Si Sandbox répond, le problème est dans la configuration du client (`VITE_GRAPHQL_URL`).

### Python : `ModuleNotFoundError: No module named 'flask_graphql'`
- **Qui a tort** : une dépendance abandonnée. `flask-graphql` ne fonctionne pas avec graphene 3.
- **Correction** : la route Flask maison de `server.py` (palier `s3-0-base`).

### Terminal du serveur : `Address already in use` sur le port 5000
- **Qui a tort** : macOS, dont le récepteur AirPlay occupe le port.
- **Correction** : `PORT=5001 python app.py`, et la même URL dans le client.
