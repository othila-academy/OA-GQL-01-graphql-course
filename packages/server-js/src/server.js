import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { authDirectiveTransformer } from './directives/auth.js';
import { userFromAuthHeader } from './auth/jwt.js';
import { findUserById } from './data/userRepository.js';
import { maskUnexpectedErrors } from './errors.js';

// Le schéma exécutable est construit puis transformé : chaque champ @auth reçoit sa garde.
const schema = authDirectiveTransformer(makeExecutableSchema({ typeDefs, resolvers }));

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ user: userFromAuthHeader(req.headers.authorization, findUserById) }),
  formatError: maskUnexpectedErrors
});

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}graphql`));
