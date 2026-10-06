import React from 'react';
import { useQuery } from '@apollo/client';
import { Activity, Calendar, Clock, Users } from 'lucide-react';
import { EventsData, GET_EVENTS, GET_USERS, UsersData } from '../queries';
import { ROLE_LABELS, formatDateRange, initials } from '../lib/format';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number; subtitle: string }> = ({ icon, title, value, subtitle }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const events = useQuery<EventsData>(GET_EVENTS, { variables: { limit: 50, offset: 0 } });
  const users = useQuery<UsersData>(GET_USERS);

  if (events.loading || users.loading) return <div className="loading">Chargement du tableau de bord…</div>;
  const failure = events.error ?? users.error;
  if (failure) return <div className="error">Erreur : {failure.message}</div>;

  const allEvents = events.data?.events ?? [];
  const allUsers = users.data?.users ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = allEvents.filter((e) => e.dateRange.start >= today);
  const totalParticipants = allEvents.reduce((sum, e) => sum + e.participants.length, 0);
  const recent = [...allEvents].sort((a, b) => b.dateRange.start.localeCompare(a.dateRange.start)).slice(0, 3);
  const organizedCount = (userId: string) => allEvents.filter((e) => e.organizer.id === userId).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d'ensemble calculée depuis les requêtes events et users</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Calendar />} title="Événements" value={allEvents.length} subtitle="Tous les événements" />
        <StatCard icon={<Users />} title="Utilisateurs" value={allUsers.length} subtitle="Membres inscrits" />
        <StatCard icon={<Clock />} title="À venir" value={upcoming.length} subtitle="Début à partir d'aujourd'hui" />
        <StatCard icon={<Activity />} title="Participations" value={totalParticipants} subtitle="Inscriptions cumulées" />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header"><h2><Calendar size={20} /> Derniers événements</h2></div>
          <div className="events-summary">
            {recent.map((e) => (
              <div key={e.id} className="event-summary-card">
                <div className="event-summary-header">
                  <h3>{e.title}</h3>
                  <span className={`status-badge ${e.dateRange.start >= today ? 'upcoming' : ''}`}>{e.dateRange.start >= today ? 'À venir' : 'Passé'}</span>
                </div>
                <div className="event-summary-details">
                  <div className="detail-item"><Clock size={14} /> {formatDateRange(e.dateRange)}</div>
                  <div className="detail-item"><Users size={14} /> {e.participants.length} participant{e.participants.length > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header"><h2><Users size={20} /> Membres</h2></div>
          <div className="users-summary">
            {allUsers.slice(0, 5).map((u) => (
              <div key={u.id} className="user-summary-card">
                <div className="user-summary-avatar">{initials(u.name)}</div>
                <div className="user-summary-info">
                  <h4>{u.name}</h4>
                  <span className={`role-badge ${u.role.toLowerCase()}`}>{ROLE_LABELS[u.role]}</span>
                  <p>{organizedCount(u.id)} événement{organizedCount(u.id) > 1 ? 's' : ''} organisé{organizedCount(u.id) > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
