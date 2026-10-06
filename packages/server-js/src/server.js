import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { authDirectiveTransformer } from './directives/auth.js';
import { userFromAuthHeader } from './auth/jwt.js';
import { findUserById } from './data/userRepository.js';
import { maskUnexpectedErrors } from './errors.js';
import { tracePlugin } from './trace/plugin.js';

// Le schéma exécutable est construit puis transformé : chaque champ @auth reçoit sa garde.
const schema = authDirectiveTransformer(makeExecutableSchema({ typeDefs, resolvers }));

// La trace des résolveurs est active par défaut : elle montre dans le terminal ce que coûte une requête.
const plugins = process.env.GRAPHQL_TRACE === '0' ? [] : [tracePlugin({ resolvers })];

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ user: userFromAuthHeader(req.headers.authorization, findUserById) }),
  formatError: maskUnexpectedErrors,
  plugins
});

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}graphql`));
