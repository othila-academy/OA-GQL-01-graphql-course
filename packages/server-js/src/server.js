import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { userFromAuthHeader } from './auth/jwt.js';
import { findUserById } from './data/userRepository.js';
import { maskUnexpectedErrors } from './errors.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Le contexte est reconstruit à chaque requête : l'utilisateur vient du header Authorization.
  context: ({ req }) => ({ user: userFromAuthHeader(req.headers.authorization, findUserById) }),
  formatError: maskUnexpectedErrors
});

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}graphql`));
