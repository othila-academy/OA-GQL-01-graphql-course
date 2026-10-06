# Serveur Python – Flask + Graphene 3 (code-first)

## Installation et démarrage
```bash
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
python app.py                                       # http://127.0.0.1:5000/graphql
```
Port occupé (AirPlay sur macOS) : `PORT=5001 python app.py`.

## Structure
```
app.py                 # entrée exécutable
server.py              # factory Flask, CORS, route POST /graphql, masquage des erreurs
data/models.py         # dataclasses UserModel et EventModel
data/repositories.py   # accès et écritures en mémoire
gql/interfaces.py      # interface Node (+ resolve_type)
gql/enums.py           # EventCategory (puis Role)
gql/date_range.py      # objet embarqué DateRange
gql/user_type.py       # type User
gql/event_type.py      # type Event
gql/unions.py          # union SearchResult
gql/query.py           # racine Query
gql/schema.py          # assemblage graphene.Schema
```

## Pourquoi une route Flask maison ?
`flask-graphql` ne fonctionne plus avec graphene 3. Une vue de quinze lignes suffit : lire le JSON, appeler `schema.execute(...)` avec un contexte, renvoyer `data` et `errors`. C'est tout ce qu'est « GraphQL sur HTTP ». Pour explorer le schéma, pointer Apollo Sandbox sur l'URL du serveur.

## Vérifier
Depuis la racine du monorepo : `npm run smoke -- http://127.0.0.1:5000/graphql`.
