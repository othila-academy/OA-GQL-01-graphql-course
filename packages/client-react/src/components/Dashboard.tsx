import React from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  MapPin,
  UserPlus,
  CalendarPlus,
  Activity
} from 'lucide-react';

// TODO: Remplacer par des données GraphQL
interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  activeEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  averageParticipation: number;
}

const Dashboard: React.FC = () => {
  // TODO: Récupérer ces données via GraphQL
  const stats: DashboardStats = {
    totalEvents: 12,
    totalUsers: 45,
    activeEvents: 3,
    upcomingEvents: 7,
    totalParticipants: 156,
    averageParticipation: 78
  };

  // TODO: Récupérer les événements récents via GraphQL
  const recentEvents = [
    {
      id: '1',
      title: 'Workshop GraphQL pour débutants',
      date: '2025-10-15',
      participants: 18,
      maxParticipants: 30,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Conférence React + GraphQL',
      date: '2025-11-20',
      participants: 45,
      maxParticipants: 100,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Hackathon GraphQL',
      date: '2025-12-05',
      participants: 23,
      maxParticipants: 50,
      status: 'upcoming'
    }
  ];

  // TODO: Récupérer les utilisateurs actifs via GraphQL
  const activeUsers = [
    { id: '1', name: 'Alice Dupont', role: 'Organisateur', eventsCount: 5 },
    { id: '2', name: 'Bob Martin', role: 'Participant', eventsCount: 8 },
    { id: '3', name: 'Claire Durand', role: 'Organisateur', eventsCount: 3 }
  ];

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ icon, title, value, subtitle, trend = 'stable' }) => (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-subtitle">
          {subtitle}
          {trend !== 'stable' && (
            <TrendingUp 
              size={12} 
              className={`trend-icon ${trend === 'up' ? 'trend-up' : 'trend-down'}`}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d'ensemble de votre plateforme d'événements</p>
        </div>
        <div className="header-actions">
          <span className="mock-data-indicator">Données factices - TODO: GraphQL</span>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <StatCard
          icon={<Calendar />}
          title="Événements totaux"
          value={stats.totalEvents}
          subtitle="Tous les événements"
          trend="up"
        />
        <StatCard
          icon={<Users />}
          title="Utilisateurs actifs"
          value={stats.totalUsers}
          subtitle="Membres inscrits"
          trend="up"
        />
        <StatCard
          icon={<Activity />}
          title="Événements actifs"
          value={stats.activeEvents}
          subtitle="En cours"
        />
        <StatCard
          icon={<Clock />}
          title="À venir"
          value={stats.upcomingEvents}
          subtitle="Prochains événements"
        />
      </div>

      <div className="dashboard-content">
        {/* Événements récents */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Calendar size={20} />
              Événements récents
            </h2>
            <button className="btn-secondary" disabled>
              Voir tous (TODO: GraphQL)
            </button>
          </div>
          
          <div className="events-summary">
            {recentEvents.map((event) => (
              <div key={event.id} className="event-summary-card">
                <div className="event-summary-header">
                  <h3>{event.title}</h3>
                  <span className={`status-badge ${event.status}`}>
                    {event.status === 'upcoming' ? 'À venir' : 'En cours'}
                  </span>
                </div>
                <div className="event-summary-details">
                  <div className="detail-item">
                    <Clock size={14} />
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="detail-item">
                    <Users size={14} />
                    {event.participants}/{event.maxParticipants} participants
                  </div>
                </div>
                <div className="participation-bar">
                  <div 
                    className="participation-fill"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Utilisateurs actifs */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Users size={20} />
              Utilisateurs actifs
            </h2>
            <button className="btn-secondary" disabled>
              Gérer (TODO: GraphQL)
            </button>
          </div>
          
          <div className="users-summary">
            {activeUsers.map((user) => (
              <div key={user.id} className="user-summary-card">
                <div className="user-summary-avatar">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="user-summary-info">
                  <h4>{user.name}</h4>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <p>{user.eventsCount} événements</p>
                </div>
                <div className="user-summary-actions">
                  <button className="btn-icon" disabled title="Voir profil (TODO: GraphQL)">
                    <Users size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <button className="action-card" disabled>
            <CalendarPlus size={24} />
            <span>Créer un événement</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <UserPlus size={24} />
            <span>Inviter des utilisateurs</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <MapPin size={24} />
            <span>Gérer les lieux</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <TrendingUp size={24} />
            <span>Voir les analytics</span>
            <small>TODO: GraphQL</small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;