import React from 'react';
import { useQuery } from '@apollo/client';
import { Activity, Award, Calendar, Mail, User } from 'lucide-react';
import { EventRef, GET_USER, UserDetailsData } from '../queries';
import { ROLE_LABELS, formatDateRange, initials } from '../lib/format';

const EventRow: React.FC<{ event: EventRef; role: 'organizer' | 'participant' }> = ({ event, role }) => (
  <div className="user-event-item">
    <div className="event-item-header">
      <h4>{event.title}</h4>
      <span className={`event-role-badge ${role}`}>
        {role === 'organizer' ? <Award size={12} /> : <Activity size={12} />} {role === 'organizer' ? 'Organisateur' : 'Participant'}
      </span>
    </div>
    <div className="event-item-details">
      <div className="detail-item"><Calendar size={14} /> {formatDateRange(event.dateRange)}</div>
      <div className="detail-item"><User size={14} /> {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}</div>
    </div>
  </div>
);

const UserDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const { loading, error, data } = useQuery<UserDetailsData>(GET_USER, { variables: { id: userId } });

  if (loading) return <div className="loading">Chargement du profil…</div>;
  if (error) return <div className="error">Erreur : {error.message}</div>;
  const user = data?.user;
  if (!user) return <div className="error">Utilisateur introuvable.</div>;

  return (
    <div className="user-details">
      <div className="user-details-header">
        <div className="user-profile-section">
          <div className="user-profile-avatar"><span className="profile-avatar-text">{initials(user.name)}</span></div>
          <div className="user-profile-info">
            <h1>{user.name}</h1>
            <span className={`role-badge ${user.role.toLowerCase()}`}>{ROLE_LABELS[user.role]}</span>
            <p className="user-member-since"><Mail size={14} /> {user.email}</p>
          </div>
        </div>
      </div>

      <div className="user-details-content">
        <div className="user-info-section">
          <div className="user-stats-detailed">
            <div className="stat-card-detailed">
              <div className="stat-icon"><Award size={24} /></div>
              <div className="stat-content">
                <span className="stat-number">{user.organizedEvents.length}</span>
                <span className="stat-label">Événements organisés</span>
              </div>
            </div>
            <div className="stat-card-detailed">
              <div className="stat-icon"><Activity size={24} /></div>
              <div className="stat-content">
                <span className="stat-number">{user.participatingEvents.length}</span>
                <span className="stat-label">Participations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-events-section">
          <h3><Calendar size={20} /> Activité</h3>
          <div className="user-events-list">
            {user.organizedEvents.map((e) => <EventRow key={`o-${e.id}`} event={e} role="organizer" />)}
            {user.participatingEvents.map((e) => <EventRow key={`p-${e.id}`} event={e} role="participant" />)}
            {user.organizedEvents.length + user.participatingEvents.length === 0 && <p>Aucune activité pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
