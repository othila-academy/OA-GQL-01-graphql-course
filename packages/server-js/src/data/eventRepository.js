import { events } from './mockData.js';

let nextId = Math.max(...events.map((e) => Number(e.id))) + 1;

export function getAllEvents() {
  return events;
}

export function findEventById(id) {
  return events.find((e) => e.id === id) || null;
}

export function searchEventsByTitle(term) {
  const lower = term.toLowerCase();
  return events.filter((e) => e.title.toLowerCase().includes(lower));
}

export function getEventsOrganizedByUser(userId) {
  return events.filter((e) => e.organizerId === userId);
}

export function getEventsParticipatedByUser(userId) {
  return events.filter((e) => e.participantIds.includes(userId));
}

export function createEvent({ title, description, category, dateRange, organizerId }) {
  const event = {
    id: String(nextId++),
    title,
    description: description ?? null,
    category,
    dateRange: { start: dateRange.start, end: dateRange.end },
    date: dateRange.start,
    organizerId,
    participantIds: []
  };
  events.push(event);
  return event;
}

/** Met à jour les champs fournis ; `undefined` et `null` signifient « inchangé ». */
export function updateEvent(id, fields) {
  const event = findEventById(id);
  if (!event) return null;
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (key === 'dateRange') {
      event.dateRange = { start: value.start, end: value.end };
      event.date = value.start;
    } else {
      event[key] = value;
    }
  }
  return event;
}

export function deleteEvent(id) {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  return true;
}

export function addParticipant(eventId, userId) {
  const event = findEventById(eventId);
  event.participantIds.push(userId);
  return event;
}

export function removeParticipant(eventId, userId) {
  const event = findEventById(eventId);
  event.participantIds = event.participantIds.filter((id) => id !== userId);
  return event;
}

export function removeUserFromAllEvents(userId) {
  for (const event of events) {
    event.participantIds = event.participantIds.filter((id) => id !== userId);
  }
}
