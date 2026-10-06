import bcrypt from 'bcryptjs';

// Mot de passe commun aux comptes de test : password123.
// Il est hashé au démarrage et n'est jamais stocké ni exposé en clair.
const hash = (password) => bcrypt.hashSync(password, 8);

export const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN', passwordHash: hash('password123') },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'TEACHER', passwordHash: hash('password123') },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'STUDENT', passwordHash: hash('password123') }
];

export const events = [
  {
    id: '101',
    title: 'Soirée jeux',
    description: 'Jeux de société et pizzas au foyer.',
    category: 'SOCIAL',
    dateRange: { start: '2026-10-20', end: '2026-10-20' },
    date: '2026-10-20',
    organizerId: '1',
    participantIds: ['1', '2']
  },
  {
    id: '102',
    title: 'Hackathon',
    description: '48 h pour prototyper une appli GraphQL.',
    category: 'TECH',
    dateRange: { start: '2026-11-14', end: '2026-11-15' },
    date: '2026-11-14',
    organizerId: '2',
    participantIds: ['2', '3']
  }
];
