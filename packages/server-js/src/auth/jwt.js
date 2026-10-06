import jwt from 'jsonwebtoken';

// En production le secret vient de l'environnement ; la valeur par défaut sert au cours.
const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const TTL = '2h';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: TTL });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/** Lit `Authorization: Bearer <token>` ; un token absent, invalide ou expiré donne un anonyme (null). */
export function userFromAuthHeader(header, findUserById) {
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    const { sub } = verifyToken(header.slice('Bearer '.length));
    return findUserById(sub);
  } catch {
    return null;
  }
}
