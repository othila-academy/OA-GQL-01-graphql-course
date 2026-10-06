# Séance 4 – Performances et temps réel (en cours)

## Palier 1 : pagination offset/limit (`s4-1-pagination`)

### Pourquoi
Un champ qui renvoie une liste doit borner ce qu'il renvoie : c'est la parade aux « requêtes larges » vue en séance 3. Avec trente-deux événements, la liste publique devient un flux à charger par pages.

### Côté serveur
```graphql
type Query {
  events(limit: Int = 10, offset: Int = 0): [Event!]!
  eventsCount: Int!
}
```
`limit` est borné (1 à 50) et `offset` doit être positif : hors bornes, `BAD_USER_INPUT`. `eventsCount` compense la limite classique de l'offset (pas de total) : c'est un choix d'API, pas une obligation.

### Côté client
- Politique de cache `offsetLimitPagination()` sur `Query.events` : les pages successives sont fusionnées dans une seule liste.
- `EventsList` demande six événements puis appelle `fetchMore({ variables: { offset: events.length } })` ; le bouton disparaît quand `events.length >= eventsCount`.
- Conséquence à connaître : cette liste fusionnée ne se raccourcit jamais. Après `deleteEvent`, le refetch réécrit N−1 éléments et le dernier resterait en double. `EventManager` évince donc l'objet supprimé du cache (`cache.evict` puis `cache.gc`, voir `src/lib/cache.ts`) : Apollo ignore ensuite la référence pendante à la lecture.
- Les écrans d'administration demandent `limit: 50` : le cache ne distinguant pas les arguments, la liste publique peut apparaître déjà complète si l'on a visité l'administration avant. Observer ce comportement, puis discuter : faut-il un champ séparé, ou une clé de cache par arguments ?

### Exercice
1. Ajouter `limit`/`offset` à `events` sur **votre** serveur, avec les bornes.
2. Brancher « Charger plus » dans le client.
3. Défi : faire la même chose pour `users`.

### Pour la suite (slides)
Pagination par curseur (`edges`, `node`, `pageInfo`), subscriptions, persisted queries.
