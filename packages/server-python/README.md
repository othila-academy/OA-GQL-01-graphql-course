# Serveur Python – Flask + Graphene 3 (code-first)

## Installation et démarrage
```bash
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
python app.py                                       # http://127.0.0.1:5000/graphql
```
Port occupé (AirPlay sur macOS) : `PORT=5001 python app.py`. Trace des résolveurs coupée : `GRAPHQL_TRACE=0`.

## Structure
```
app.py                 # entrée exécutable
server.py              # factory Flask, CORS, route POST /graphql, masquage des erreurs, trace
trace_resolvers.py     # middleware graphene : trace des résolveurs (testé : python -m unittest test_trace)
data/models.py         # dataclasses UserModel et EventModel
data/repositories.py   # accès et écritures en mémoire
auth/jwt_utils.py      # signature et lecture du token (PyJWT)
auth/guards.py         # require_auth, require_role, require_owner_or_admin
gql/interfaces.py      # interface Node (+ resolve_type)
gql/enums.py           # EventCategory, Role
gql/date_range.py      # objet embarqué DateRange
gql/inputs.py          # types input des mutations
gql/user_type.py       # type User
gql/event_type.py      # type Event
gql/auth_payload.py    # AuthPayload (token + user)
gql/unions.py          # union SearchResult
gql/errors.py          # not_found, bad_input, enum_value
gql/decorators.py      # @auth_required, équivalent code-first de la directive @auth
gql/query.py           # racine Query (dont pagination)
gql/mutation.py        # racine Mutation et règles d'accès
gql/schema.py          # assemblage graphene.Schema
```

## Pourquoi une route Flask maison ?
`flask-graphql` ne fonctionne plus avec graphene 3. Une vue de quinze lignes suffit : lire le JSON, appeler `schema.execute(...)` avec un contexte, renvoyer `data` et `errors`. C'est tout ce qu'est « GraphQL sur HTTP ». Pour explorer le schéma, pointer Apollo Sandbox sur l'URL du serveur.

## Vérifier
Depuis la racine du monorepo : `npm run smoke -- http://127.0.0.1:5000/graphql`.
