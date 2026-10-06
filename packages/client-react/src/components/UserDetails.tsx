import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Activity,
  MapPin,
  MessageCircle,
  Settings,
  UserPlus,
  UserMinus
} from 'lucide-react';

interface UserDetailsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    eventsOrganized: number;
    eventsAttended: number;
    joinDate: string;
  };
  currentUser?: {
    id: string;
    name: string;
  };
  isCurrentUser?: boolean;
  onSendMessage?: () => void;
  onAddFriend?: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  currentUser,
  isCurrentUser = false,
  onSendMessage,
  onAddFriend
}) => {
  // TODO: Récupérer les événements de l'utilisateur via GraphQL
  const mockUserEvents = [
    {
      id: '1',
      title: 'Workshop GraphQL pour débutants',
      date: '2025-10-15',
      role: 'organizer',
      participants: 18
    },
    {
      id: '2',
      title: 'Conférence React + GraphQL',
      date: '2025-11-20',
      role: 'participant',
      participants: 45
    }
  ];

  return (
    <div className="user-details">
      <div className="user-details-header">
        <div className="user-profile-section">
          <div className="user-profile-avatar">
            <User size={40} />
            <span className="profile-avatar-text">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="user-profile-info">
            <h1>{user.name}</h1>
            <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
              {user.role === 'Organisateur' ? <Award size={16} /> : <Activity size={16} />}
              {user.role}
            </span>
            <p className="user-member-since">
              <Calendar size={14} />
              Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div className="user-actions-header">
          {!isCurrentUser && (
            <>
              <button 
                className="btn-primary" 
                onClick={onSendMessage}
                disabled
              >
                <MessageCircle size={16} />
                Message (TODO: GraphQL)
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={onAddFriend}
                disabled
              >
                <UserPlus size={16} />
                Suivre (TODO: GraphQL)
              </button>
            </>
          )}
          
          {isCurrentUser && (
            <button className="btn-secondary" disabled>
              <Settings size={16} />
              Modifier profil (TODO: GraphQL)
            </button>
          )}
        </div>
      </div>

      <div className="user-details-content">
        <div className="user-info-section">
          <h3>Informations</h3>
          
          <div className="user-info-grid">
            <div className="info-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <p>{user.email}</p>
              </div>
            </div>
            
            <div className="info-item">
              <MapPin size={20} />
              <div>
                <strong>Localisation</strong>
                <p>Paris, France (TODO: GraphQL)</p>
              </div>
            </div>
          </div>

          <div className="user-stats-detailed">
            <div className="stat-card-detailed">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{user.eventsOrganized}</span>
                <span className="stat-label">Événements organisés</span>
                <span className="stat-description">
                  Total des événements créés et gérés
                </span>
              </div>
            </div>
            
            <div className="stat-card-detailed">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{user.eventsAttended}</span>
                <span className="stat-label">Événements suivis</span>
                <span className="stat-description">
                  Total des participations aux événements
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-events-section">
          <h3>
            <Calendar size={20} />
            Activité récente
          </h3>
          
          <div className="todo-section">
            <p>
              <strong>TODO GraphQL:</strong> Afficher les vrais événements de l'utilisateur
            </p>
            <small>Les données ci-dessous sont factices pour la démonstration</small>
          </div>
          
          <div className="user-events-list">
            {mockUserEvents.map((event) => (
              <div key={event.id} className="user-event-item">
                <div className="event-item-header">
                  <h4>{event.title}</h4>
                  <span className={`event-role-badge ${event.role}`}>
                    {event.role === 'organizer' ? <Award size={12} /> : <Activity size={12} />}
                    {event.role === 'organizer' ? 'Organisateur' : 'Participant'}
                  </span>
                </div>
                
                <div className="event-item-details">
                  <div className="detail-item">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="detail-item">
                    <User size={14} />
                    {event.participants} participants
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-view-all" disabled>
            Voir tous les événements (TODO: GraphQL)
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;