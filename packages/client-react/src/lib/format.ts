import type { EventCategory, Role } from '../queries';

/** Les dates du schéma sont des chaînes YYYY-MM-DD : on les formate sans passer par Date (indépendant du fuseau). */
export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : iso;
}

export function formatDateRange(range: { start: string; end: string }): string {
  return range.start === range.end ? formatDate(range.start) : `${formatDate(range.start)} → ${formatDate(range.end)}`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const ROLE_LABELS: Record<Role, string> = { ADMIN: 'Admin', TEACHER: 'Enseignant', STUDENT: 'Étudiant' };

export const CATEGORY_LABELS: Record<EventCategory, string> = { SOCIAL: 'Social', TECH: 'Tech', MEETUP: 'Meetup', OTHER: 'Autre' };
