import { getEventsOrganizedByUser, getEventsParticipatedByUser } from '../data/eventRepository.js';

export const userResolvers = {
  organizedEvents: (user) => getEventsOrganizedByUser(user.id),
  participatingEvents: (user) => getEventsParticipatedByUser(user.id)
};
