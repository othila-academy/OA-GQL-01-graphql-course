import { findUserById, getAllUsers, searchUsersByName } from '../data/userRepository.js';
import { findEventById, getAllEvents, searchEventsByTitle } from '../data/eventRepository.js';

export const queryResolvers = {
  users: () => getAllUsers(),
  events: () => getAllEvents(),
  user: (_parent, { id }) => findUserById(id),
  event: (_parent, { id }) => findEventById(id),
  search: (_parent, { term }) => {
    if (!term || !term.trim()) return [];
    return [...searchUsersByName(term), ...searchEventsByTitle(term)];
  }
};
