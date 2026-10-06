# Python Version – Flask + Graphene (Séance 2)

## Prérequis
- Python 3.10+

## Installation & démarrage
```
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Structure
```
data/
  models.py                  # Modèles simples en mémoire
  repositories.py            # Accès / filtres / recherche
gql/
  interfaces.py              # Interface Node
  enums.py                   # Enumérations
  date_range.py              # Objet embarqué DateRange
  user_type.py               # Type User + résolutions relationnelles
  event_type.py              # Type Event + résolutions relationnelles
  unions.py                  # Union SearchResult
  query.py                   # Root Query
  schema.py (+ __init__)     # Assemblage Graphene
server.py                    # Factory Flask + route /graphql
app.py                       # Entrée exécutable
FRAGMENTS_EXAMPLE.graphql    # Exemples de fragments
```

> Organisation inspirée de la version JS (résolveurs modulaires) pour illustrer la transposition code‑first.

## Concepts ajoutés
- Interface `Node`
- Enum `EventCategory`
- Objet `DateRange`
- Relations 1-N & N-N
- Union `SearchResult`
- Champ déprécié `Event.date`

## Requête (fragment)
```
fragment UserInfo on User { id name }
query {
  events { id title category dateRange { start end } organizer { ...UserInfo } participants { ...UserInfo } }
}
```

## Recherche
```
query { search(term: "hack") { ... on Event { id title } ... on User { id name } } }
```

## Note
`date` est conservé pour transition vers `dateRange`.

