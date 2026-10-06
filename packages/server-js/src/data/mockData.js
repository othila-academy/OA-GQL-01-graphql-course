import bcrypt from 'bcryptjs';

// Mot de passe commun aux comptes de test : password123.
// Il est hashé au démarrage et n'est jamais stocké ni exposé en clair.
const hash = (password) => bcrypt.hashSync(password, 8);

export const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN', passwordHash: hash('password123') },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'TEACHER', passwordHash: hash('password123') },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'STUDENT', passwordHash: hash('password123') }
];

const CATEGORIES = ['SOCIAL', 'TECH', 'MEETUP', 'OTHER'];

/** Génère des événements déterministes, un tous les six jours à partir de fin octobre 2026. */
function generateEvents(count, firstId) {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const startDate = new Date(Date.UTC(2026, 9, 25 + i * 6));
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + (i % 3 === 0 ? 1 : 0));
    const start = startDate.toISOString().slice(0, 10);
    const end = endDate.toISOString().slice(0, 10);
    const organizerId = String((i % 3) + 1);
    const participantIds = ['1', '2', '3'].filter((id, index) => id !== organizerId && (i + index) % 2 === 0);
    generated.push({
      id: String(firstId + i),
      title: `Atelier n°${i + 1}`,
      description: `Événement généré pour illustrer la pagination (${i + 1}/${count}).`,
      category: CATEGORIES[i % CATEGORIES.length],
      dateRange: { start, end },
      date: start,
      organizerId,
      participantIds
    });
  }
  return generated;
}

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
  },
  ...generateEvents(30, 103)
];
