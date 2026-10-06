# TP GraphQL - Intégration React + Apollo Client

## 🎯 Objectif

Ce TP vous guide dans l'intégration de GraphQL avec React en utilisant Apollo Client. Vous allez connecter une application React à un serveur GraphQL et afficher des données dynamiques.

## 📋 Prérequis

- Node.js installé
- Un serveur GraphQL fonctionnel (voir les dossiers `server-js` ou `server-python`)
- Connaissances de base en React et TypeScript

## 🚀 Démarrage

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

3. **Ouvrir l'application** : http://localhost:3000

## 📝 Étapes du TP

### Étape 1 : Configuration d'Apollo Client

📂 **Fichier** : `src/apollo-client.ts`

1. Remplacez `'YOUR_GRAPHQL_ENDPOINT'` par l'URL de votre serveur GraphQL :
   - Serveur JavaScript : `http://localhost:4000/graphql`
   - Serveur Python : `http://127.0.0.1:5000/graphql`

2. Vérifiez que votre serveur GraphQL est bien démarré

### Étape 2 : Définir les requêtes GraphQL

📂 **Fichier** : `src/queries.ts`

1. Décommentez et adaptez la requête `GET_EVENTS`
2. Décommentez et adaptez la requête `GET_USERS`
3. Ajustez les champs selon votre schéma GraphQL

Exemple de requête :
```graphql
export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      date
      organizer {
        id
        name
      }
    }
  }
`;
```

### Étape 3 : Intégrer GraphQL dans EventsList

📂 **Fichier** : `src/components/EventsList.tsx`

1. Décommentez les imports :
   ```typescript
   import { useQuery } from '@apollo/client';
   import { GET_EVENTS } from '../queries';
   ```

2. Décommentez et utilisez `useQuery` :
   ```typescript
   const { loading, error, data } = useQuery<EventsData>(GET_EVENTS);
   ```

3. Décommentez la gestion des états loading/error

4. Remplacez `mockEvents` par `data?.events` dans le rendu

### Étape 4 : Intégrer GraphQL dans UsersList

📂 **Fichier** : `src/components/UsersList.tsx`

Répétez les mêmes étapes que pour EventsList :
1. Décommentez les imports
2. Utilisez `useQuery` avec `GET_USERS`
3. Gérez loading/error
4. Utilisez les vraies données

### Étape 5 : Activer les composants dans App

📂 **Fichier** : `src/App.tsx`

1. Décommentez les composants GraphQL :
   ```tsx
   <div className="content-grid">
     <EventsList />
     <UsersList />
   </div>
   ```

2. Commentez ou supprimez les placeholders

## 🔍 Test et Debug

### Vérifications

- [ ] Le serveur GraphQL est démarré
- [ ] L'endpoint dans `apollo-client.ts` est correct
- [ ] Les requêtes GraphQL correspondent au schéma du serveur
- [ ] Les composants affichent les données sans erreur

### Outils de debug

1. **Console du navigateur** : Vérifiez les erreurs JavaScript
2. **Network tab** : Vérifiez les requêtes GraphQL
3. **Apollo DevTools** : Extension pour Chrome/Firefox

## 🎓 Exercices supplémentaires

### Exercice 1 : Champs supplémentaires
Ajoutez des champs à vos requêtes (description, email, etc.)

### Exercice 2 : Requête avec variables
Créez une requête pour récupérer un événement par ID

### Exercice 3 : Gestion d'erreur personnalisée
Améliorez l'affichage des erreurs avec des messages plus explicites

### Exercice 4 : Optimisation
Utilisez les options de cache d'Apollo pour optimiser les performances

## 📚 Resources

- [Documentation Apollo Client](https://www.apollographql.com/docs/react/)
- [GraphQL Query Language](https://graphql.org/learn/)
- [React + TypeScript](https://react.dev/learn/typescript)

## 🆘 Problèmes courants

### Erreur CORS
Assurez-vous que votre serveur GraphQL autorise les requêtes depuis `http://localhost:3000`

### Erreur de connexion
Vérifiez que l'URL du serveur GraphQL est correcte et que le serveur fonctionne

### Erreur de schéma
Utilisez GraphiQL ou Apollo Sandbox pour explorer le schéma GraphQL disponible

## ✅ Validation

Votre TP est réussi quand :
- L'application affiche les événements et utilisateurs depuis GraphQL
- Les états de loading sont gérés
- Les erreurs sont affichées proprement
- Les données sont à jour (pas de données fictives)

Bon code ! 🚀