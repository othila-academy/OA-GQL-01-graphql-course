import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { getToken } from './auth-storage';

export const GRAPHQL_URL: string = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

const httpLink = createHttpLink({ uri: GRAPHQL_URL });

// À chaque opération, le token du localStorage part dans le header Authorization.
const authLink = setContext((_operation, { headers }) => {
  const token = getToken();
  return { headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } };
});

/** Une seule liste `events` dans le cache : fetchMore y ajoute les pages suivantes. */
export function createCache() {
  return new InMemoryCache({ typePolicies: { Query: { fields: { events: offsetLimitPagination() } } } });
}

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: createCache()
});

export default client;
