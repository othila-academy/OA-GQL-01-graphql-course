import { UserInputError } from 'apollo-server';
import { notFound } from '../errors.js';
import * as events from '../data/eventRepository.js';
import * as users from '../data/userRepository.js';

const isSet = (value) => value !== undefined && value !== null;

function validateTitle(title) {
  if (!title || !title.trim()) throw new UserInputError('Le titre est obligatoire');
}

function validateDateRange({ start, end }) {
  if (end < start) throw new UserInputError('dateRange.end doit être postérieure ou égale à dateRange.start');
}

function getEventOr404(id) {
  const event = events.findEventById(id);
  if (!event) throw notFound('Event', id);
  return event;
}

function getUserOr404(id) {
  const user = users.findUserById(id);
  if (!user) throw notFound('User', id);
  return user;
}

export const mutationResolvers = {
  createEvent: (_parent, { input }) => {
    validateTitle(input.title);
    validateDateRange(input.dateRange);
    getUserOr404(input.organizerId);
    return events.createEvent({ ...input, title: input.title.trim() });
  },

  updateEvent: (_parent, { id, input }) => {
    getEventOr404(id);
    if (isSet(input.title)) validateTitle(input.title);
    if (isSet(input.dateRange)) validateDateRange(input.dateRange);
    return events.updateEvent(id, { ...input, title: isSet(input.title) ? input.title.trim() : undefined });
  },

  deleteEvent: (_parent, { id }) => {
    getEventOr404(id);
    return events.deleteEvent(id);
  },

  joinEvent: (_parent, { eventId, userId }) => {
    const event = getEventOr404(eventId);
    getUserOr404(userId);
    if (event.participantIds.includes(userId)) throw new UserInputError('Utilisateur déjà inscrit à cet événement');
    return events.addParticipant(eventId, userId);
  },

  leaveEvent: (_parent, { eventId, userId }) => {
    const event = getEventOr404(eventId);
    getUserOr404(userId);
    if (!event.participantIds.includes(userId)) throw new UserInputError("Utilisateur non inscrit à cet événement");
    return events.removeParticipant(eventId, userId);
  },

  createUser: (_parent, { input }) => {
    if (!input.name?.trim()) throw new UserInputError('Le nom est obligatoire');
    return users.createUser({ name: input.name.trim() });
  },

  updateUser: (_parent, { id, input }) => {
    getUserOr404(id);
    if (isSet(input.name) && !input.name.trim()) throw new UserInputError('Le nom est obligatoire');
    return users.updateUser(id, { name: isSet(input.name) ? input.name.trim() : undefined });
  },

  deleteUser: (_parent, { id }) => {
    getUserOr404(id);
    if (events.getEventsOrganizedByUser(id).length > 0) {
      throw new UserInputError('Impossible de supprimer un utilisateur qui organise encore des événements');
    }
    events.removeUserFromAllEvents(id);
    return users.deleteUser(id);
  }
};
