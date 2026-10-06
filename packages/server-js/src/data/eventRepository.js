import { events } from './mockData.js';

export function getAllEvents() {
  return events;
}

export function findEventById(id) {
  return events.find(e => e.id === id) || null;
}

export function searchEventsByTitle(term) {
  const lower = term.toLowerCase();
  return events.filter(e => e.title.toLowerCase().includes(lower));
}

export function getEventsOrganizedByUser(userId) {
  return events.filter(e => e.organizerId === userId);
}

export function getEventsParticipatedByUser(userId) {
  return events.filter(e => e.participantIds.includes(userId));
}
