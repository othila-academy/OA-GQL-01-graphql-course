# JS Version – Apollo Server (Séance 2)

## Prérequis
- Node.js 18+

## Installation & démarrage
```
npm install
npm run dev
```

## Structure
```
src/
  data/mockData.js       # Données en mémoire
  schema/typeDefs.js     # Schéma SDL (schema-first)
  resolvers/             # Résolveurs modulaires
    query.js             # Query root
    user.js              # Champs du type User
    event.js             # Champs du type Event
    node.js              # Interface Node
    searchResult.js      # Union SearchResult
    index.js             # Agrégateur final
  server.js              # Entrée serveur Apollo
FRAGMENTS_EXAMPLE.graphql
```

## Nouveautés Séance 2
- Interface `Node`
- Enum `EventCategory`
- Objet embarqué `DateRange`
- Relations 1-N & N-N
- Union `SearchResult`
- Fragment `UserInfo`

## Requête avec fragment
```
fragment UserInfo on User { id name }
query {
  events { id title category dateRange { start end } organizer { ...UserInfo } participants { ...UserInfo } }
}
```

## Recherche (union)
```
query { search(term: "hack") { ... on Event { id title } ... on User { id name } } }
```

## Dépréciation
Le champ `Event.date` est conservé mais marqué `@deprecated` au profit de `dateRange`.

