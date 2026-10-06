import { getAllUsers, searchUsersByName } from '../data/userRepository.js';
import { getAllEvents, searchEventsByTitle } from '../data/eventRepository.js';

export const queryResolvers = {
  users: () => getAllUsers(),
  events: () => getAllEvents(),
  search: (_parent, { term }) => {
    if (!term || !term.trim()) return [];
    return [
      ...searchUsersByName(term),
      ...searchEventsByTitle(term)
    ];
  }
};
