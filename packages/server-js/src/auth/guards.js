import { AuthenticationError, ForbiddenError } from 'apollo-server';

/** Exige un utilisateur connecté et le renvoie. */
export function requireAuth(context) {
  if (!context.user) throw new AuthenticationError('Authentification requise');
  return context.user;
}

/** Exige le rôle donné ; un ADMIN passe toujours. */
export function requireRole(context, role) {
  const user = requireAuth(context);
  if (user.role !== role && user.role !== 'ADMIN') throw new ForbiddenError(`Rôle ${role} requis`);
  return user;
}

/** Exige d'être le propriétaire de la ressource (ou ADMIN). */
export function requireOwnerOrAdmin(context, ownerId, message) {
  const user = requireAuth(context);
  if (user.id !== ownerId && user.role !== 'ADMIN') throw new ForbiddenError(message);
  return user;
}
