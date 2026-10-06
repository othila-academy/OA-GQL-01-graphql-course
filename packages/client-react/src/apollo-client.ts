import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// TODO: Configurer Apollo Client pour se connecter au serveur GraphQL
// TODO: Remplacer 'YOUR_GRAPHQL_ENDPOINT' par l'URL de votre serveur
const httpLink = createHttpLink({
  uri: 'YOUR_GRAPHQL_ENDPOINT', // TODO: À remplacer par http://localhost:4000/graphql
});

// TODO: Créer une instance d'Apollo Client avec le lien HTTP et le cache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // TODO: Ajouter d'autres options si nécessaire (headers, gestion d'erreurs, etc.)
});

export default client;