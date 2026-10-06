import { users } from './mockData.js';

let nextId = Math.max(...users.map((u) => Number(u.id))) + 1;

export function getAllUsers() {
  return users;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}

export function searchUsersByName(term) {
  const lower = term.toLowerCase();
  return users.filter((u) => u.name.toLowerCase().includes(lower));
}

export function createUser(fields) {
  const user = { id: String(nextId++), ...fields };
  users.push(user);
  return user;
}

/** Met à jour les champs fournis ; `undefined` et `null` signifient « inchangé ». */
export function updateUser(id, fields) {
  const user = findUserById(id);
  if (!user) return null;
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) user[key] = value;
  }
  return user;
}

export function deleteUser(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}
