# 🚀 GraphQL Course - React Client (Interface Moderne)

Une interface moderne de gestion d'événements construite avec React et Apollo Client pour apprendre GraphQL de manière pratique et visuelle.

## 🎯 Objectifs Pédagogiques

Cette application présente une **interface complète et moderne** avec des données factices pour que les étudiants puissent se concentrer sur l'intégration GraphQL sans se soucier du design.

### ✨ Fonctionnalités de l'Interface

- 📅 **Liste des événements** avec détails complets et visuels attractifs
- 👥 **Gestion des utilisateurs** avec avatars et statistiques
- ⚙️ **Interface d'administration** pour créer des événements
- 🔍 **Filtres et recherche** (prêts pour GraphQL)
- 📱 **Design responsive** et moderne
- 🎨 **Interface intuitive** sans frameworks externes
- 💡 **Indicateurs pédagogiques** visuels pour guider l'apprentissage

## 🚧 Architecture TODOs

L'application utilise des **données factices** et des **composants désactivés** pour montrer aux étudiants où ils devront intégrer GraphQL :

### 📁 Structure des fichiers

```
src/
├── apollo-client.ts        # ⚠️ Configuration Apollo à compléter
├── queries.ts             # ⚠️ Requêtes GraphQL à définir (exemples fournis)
├── components/
│   ├── EventsList.tsx     # ✅ Interface moderne + TODOs GraphQL
│   ├── UsersList.tsx      # ✅ Interface moderne + TODOs GraphQL
│   └── EventManager.tsx   # ✅ Formulaire complet + TODOs GraphQL
└── App.tsx               # ✅ Layout principal avec sections pédagogiques
```

### 🎯 Missions des étudiants

1. **Configuration Apollo Client** (`apollo-client.ts`)
   - Configurer l'endpoint GraphQL
   - Gérer l'authentification si nécessaire
   - Configurer le cache

2. **Définition des requêtes** (`queries.ts`)
   - Décommenter et adapter les requêtes exemples fournies
   - Créer les mutations pour CRUD
   - Ajouter les subscriptions (optionnel)

3. **Intégration dans les composants**
   - Remplacer les données factices par `useQuery`
   - Implémenter `useMutation` dans les formulaires
   - Gérer les états loading/error
   - Activer la fonctionnalité de recherche/filtres

## 🔧 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev
```

L'application sera disponible sur http://localhost:3001 (ou le port suivant libre)

## 🎨 Design System

L'interface utilise un design system moderne avec :

- **Variables CSS** pour la cohérence des couleurs
- **Gradients et animations** subtiles
- **Layout responsive** optimisé mobile/desktop
- **Cartes interactives** avec hover effects
- **Barres de progression** pour les participants
- **Avatars générés** automatiquement
- **Badges colorés** pour les catégories et rôles

## 🏗️ Indicateurs Pédagogiques

L'interface guide visuellement les étudiants :

- 🟡 **Badges "TODO GraphQL"** sur les éléments à intégrer
- 🔵 **Badges "Données factices"** sur les composants temporaires
- 🔴 **Boutons désactivés** avec mentions "(TODO: GraphQL)"
- 💡 **Sections d'aide** avec instructions détaillées
- 📋 **Listes de TODOs** dans les formulaires
- 🎯 **Section objectifs** en en-tête

## 📚 Guide d'Intégration GraphQL

### 1. Configuration Apollo Client

```typescript
// apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Votre endpoint GraphQL
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
```

### 2. Exemple de requête (fournie dans queries.ts)

```typescript
export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date
      location
      maxParticipants
      currentParticipants
      category
      organizer {
        id
        name
        email
      }
    }
  }
`;
```

### 3. Utilisation dans un composant

```typescript
// Remplacer dans EventsList.tsx :
// const mockEvents = [...] 
// par :
const { loading, error, data } = useQuery<EventsData>(GET_EVENTS);

if (loading) return <div className="loading">Loading events...</div>;
if (error) return <div className="error">Error: {error.message}</div>;

// Remplacer mockEvents par data?.events dans le map()
```

## 🤝 Structure du Cours

Cette interface s'intègre dans un cours progressif :

1. **Séance 1** : Découverte de l'interface et des concepts GraphQL
2. **Séance 2** : Configuration Apollo et premières requêtes
3. **Séance 3** : Mutations et gestion d'état avec formulaires
4. **Séance 4** : Optimisations, cache et features avancées

## Technologies utilisées

- **React 18** avec TypeScript
- **Vite** pour le développement moderne et rapide
- **Apollo Client** pour GraphQL (à configurer)
- **CSS3** moderne avec variables et animations
- **Design responsive** natif

## Configuration des endpoints

Une fois complété, le client pourra se connecter aux serveurs :

### Serveur JavaScript (Apollo Server)
- URL: `http://localhost:4000/graphql`
- Apollo Sandbox disponible

### Serveur Python (Flask + Graphene)  
- URL: `http://127.0.0.1:5000/graphql`
- GraphiQL disponible

## Scripts disponibles

```bash
npm run dev      # Lance l'application en mode développement
npm run build    # Génère une version de production
npm run preview  # Prévisualise la version de production
npm test         # Lance les tests avec Vitest
```

## 📖 Ressources d'Apprentissage

- [Documentation Apollo Client](https://www.apollographql.com/docs/react/)
- [Guide GraphQL](https://graphql.org/learn/)
- [Playground GraphQL en ligne](https://studio.apollographql.com/)
- [Instructions détaillées du TP](./TP_INSTRUCTIONS.md)

---

🎓 **Othila Academy - GraphQL Course**  
Une approche pratique et visuelle pour maîtriser GraphQL avec React !