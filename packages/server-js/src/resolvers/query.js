import { UserInputError } from 'apollo-server';
import { findUserById, getAllUsers, searchUsersByName } from '../data/userRepository.js';
import { findEventById, getAllEvents, searchEventsByTitle } from '../data/eventRepository.js';

export const queryResolvers = {
  users: () => getAllUsers(),
  events: (_parent, { limit, offset }) => {
    if (limit < 1 || limit > 50) throw new UserInputError('limit doit être compris entre 1 et 50');
    if (offset < 0) throw new UserInputError('offset doit être positif ou nul');
    return getAllEvents().slice(offset, offset + limit);
  },
  eventsCount: () => getAllEvents().length,
  user: (_parent, { id }) => findUserById(id),
  event: (_parent, { id }) => findEventById(id),
  me: (_parent, _args, context) => context.user, // @auth garantit un utilisateur connecté
  search: (_parent, { term }) => {
    if (!term || !term.trim()) return [];
    return [...searchUsersByName(term), ...searchEventsByTitle(term)];
  }
};
