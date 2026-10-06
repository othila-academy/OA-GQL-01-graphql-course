export const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' }
];

export const events = [
  {
    id: '101',
    title: 'Soirée jeux',
    category: 'SOCIAL',
    dateRange: { start: '2025-10-01', end: '2025-10-01' },
    date: '2025-10-01',
    organizerId: '1',
    participantIds: ['1', '2']
  },
  {
    id: '102',
    title: 'Hackathon',
    category: 'TECH',
    dateRange: { start: '2025-11-15', end: '2025-11-16' },
    date: '2025-11-15',
    organizerId: '2',
    participantIds: ['2', '3']
  }
];
