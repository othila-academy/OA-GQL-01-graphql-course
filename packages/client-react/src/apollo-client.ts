import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from './auth-storage';

export const GRAPHQL_URL: string = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

const httpLink = createHttpLink({ uri: GRAPHQL_URL });

// À chaque opération, le token du localStorage part dans le header Authorization.
const authLink = setContext((_operation, { headers }) => {
  const token = getToken();
  return { headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
