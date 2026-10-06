import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { notFound } from '../errors.js';
import { signToken } from '../auth/jwt.js';
import { requireAuth, requireOwnerOrAdmin, requireRole } from '../auth/guards.js';
import * as events from '../data/eventRepository.js';
import * as users from '../data/userRepository.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isSet = (value) => value !== undefined && value !== null;

function validateTitle(title) {
  if (!title || !title.trim()) throw new UserInputError('Le titre est obligatoire');
}

function validateDateRange({ start, end }) {
  if (end < start) throw new UserInputError('dateRange.end doit être postérieure ou égale à dateRange.start');
}

/** Normalise un email (minuscules, sans espaces) et garantit son unicité. */
function normalizeEmail(email, excludeUserId = null) {
  const normalized = (email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) throw new UserInputError('Email invalide');
  const existing = users.findUserByEmail(normalized);
  if (existing && existing.id !== excludeUserId) throw new UserInputError('Cet email est déjà utilisé');
  return normalized;
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
  login: (_parent, { email, password }) => {
    const user = users.findUserByEmail(email.trim().toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      throw new AuthenticationError('Identifiants invalides');
    }
    return { token: signToken(user), user };
  },

  createEvent: (_parent, { input }, context) => {
    const me = requireAuth(context);
    validateTitle(input.title);
    validateDateRange(input.dateRange);
    return events.createEvent({ ...input, title: input.title.trim(), organizerId: me.id });
  },

  updateEvent: (_parent, { id, input }, context) => {
    const event = getEventOr404(id);
    requireOwnerOrAdmin(context, event.organizerId, "Seul l'organisateur ou un ADMIN peut modifier cet événement");
    if (isSet(input.title)) validateTitle(input.title);
    if (isSet(input.dateRange)) validateDateRange(input.dateRange);
    return events.updateEvent(id, { ...input, title: isSet(input.title) ? input.title.trim() : undefined });
  },

  deleteEvent: (_parent, { id }, context) => {
    const event = getEventOr404(id);
    requireOwnerOrAdmin(context, event.organizerId, "Seul l'organisateur ou un ADMIN peut supprimer cet événement");
    return events.deleteEvent(id);
  },

  joinEvent: (_parent, { eventId }, context) => {
    const me = requireAuth(context);
    const event = getEventOr404(eventId);
    if (event.participantIds.includes(me.id)) throw new UserInputError('Vous êtes déjà inscrit à cet événement');
    return events.addParticipant(eventId, me.id);
  },

  leaveEvent: (_parent, { eventId }, context) => {
    const me = requireAuth(context);
    const event = getEventOr404(eventId);
    if (!event.participantIds.includes(me.id)) throw new UserInputError("Vous n'êtes pas inscrit à cet événement");
    return events.removeParticipant(eventId, me.id);
  },

  createUser: (_parent, { input }, context) => {
    if (!input.name?.trim()) throw new UserInputError('Le nom est obligatoire');
    if (!input.password || input.password.length < 8) throw new UserInputError('Le mot de passe doit faire au moins 8 caractères');
    const email = normalizeEmail(input.email);
    // Seul un ADMIN connecté peut choisir le rôle ; sinon STUDENT.
    const role = context.user?.role === 'ADMIN' && input.role ? input.role : 'STUDENT';
    return users.createUser({ name: input.name.trim(), email, role, passwordHash: bcrypt.hashSync(input.password, 8) });
  },

  updateUser: (_parent, { id, input }, context) => {
    getUserOr404(id);
    requireOwnerOrAdmin(context, id, "Seul l'utilisateur lui-même ou un ADMIN peut modifier ce profil");
    if (isSet(input.role)) requireRole(context, 'ADMIN');
    if (isSet(input.name) && !input.name.trim()) throw new UserInputError('Le nom est obligatoire');
    return users.updateUser(id, {
      name: isSet(input.name) ? input.name.trim() : undefined,
      email: isSet(input.email) ? normalizeEmail(input.email, id) : undefined,
      role: input.role ?? undefined
    });
  },

  deleteUser: (_parent, { id }, context) => {
    requireRole(context, 'ADMIN');
    getUserOr404(id);
    if (events.getEventsOrganizedByUser(id).length > 0) {
      throw new UserInputError('Impossible de supprimer un utilisateur qui organise encore des événements');
    }
    events.removeUserFromAllEvents(id);
    return users.deleteUser(id);
  }
};
