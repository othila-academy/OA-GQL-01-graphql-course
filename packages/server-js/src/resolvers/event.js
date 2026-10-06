import { getAllUsers } from '../data/userRepository.js';

export const eventResolvers = {
  organizer: (event) => {
    const users = getAllUsers();
    return users.find(u => u.id === event.organizerId) || null;
  },
  participants: (event) => {
    const users = getAllUsers();
    return event.participantIds.map(pid => users.find(u => u.id === pid)).filter(Boolean);
  }
};
