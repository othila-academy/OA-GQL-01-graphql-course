import { users } from './mockData.js';

/**
 * Retourne tous les utilisateurs.
 */
export function getAllUsers() {
  return users;
}

/**
 * Trouve un utilisateur par son id.
 * @param {string} id
 */
export function findUserById(id) {
  return users.find(u => u.id === id) || null;
}

/**
 * Recherche des utilisateurs via une sous-chaîne insensible à la casse.
 * @param {string} term
 */
export function searchUsersByName(term) {
  const lower = term.toLowerCase();
  return users.filter(u => u.name.toLowerCase().includes(lower));
}
