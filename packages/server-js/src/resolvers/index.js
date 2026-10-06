// Agrégation centrale des resolvers modulaires.
import { queryResolvers } from './query.js';
import { userResolvers } from './user.js';
import { eventResolvers } from './event.js';
import { nodeInterfaceResolver } from './node.js';
import { searchResultUnionResolver } from './searchResult.js';

export const resolvers = {
  Node: nodeInterfaceResolver,
  SearchResult: searchResultUnionResolver,
  Query: queryResolvers,
  User: userResolvers,
  Event: eventResolvers
};

