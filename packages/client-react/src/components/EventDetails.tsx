import React from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Mail,
  UserPlus,
  UserMinus,
  Settings,
  Share2,
  Bookmark
} from 'lucide-react';

interface EventDetailsProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    category: string;
    organizer: {
      id: string;
      name: string;
      email: string;
    };
  };
  currentUser?: {
    id: string;
    name: string;
  };
  isRegistered?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  currentUser,
  isRegistered = false,
  onRegister,
  onUnregister
}) => {
  // TODO: Récupérer les participants via GraphQL
  const mockParticipants = [
    { id: '1', name: 'Alice Dupont', email: 'alice@example.com' },
    { id: '2', name: 'Bob Martin', email: 'bob@example.com' },
    { id: '3', name: 'Claire Durand', email: 'claire@example.com' }
  ];

  const isOrganizer = currentUser?.id === event.organizer.id;
  const availableSpots = event.maxParticipants - event.currentParticipants;
  const isFull = availableSpots <= 0;

  return (
    <div className="event-details">
      <div className="event-details-header">
        <div className="event-title-section">
          <h1>{event.title}</h1>
          <span className={`category-badge ${event.category.toLowerCase()}`}>
            {event.category}
          </span>
        </div>
        
        <div className="event-actions-header">
          {!isOrganizer && (
            <>
              {isRegistered ? (
                <button 
                  className="btn-danger" 
                  onClick={onUnregister}
                  disabled
                >
                  <UserMinus size={16} />
                  Se désinscrire (TODO: GraphQL)
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  onClick={onRegister}
                  disabled={isFull}
                >
                  <UserPlus size={16} />
                  {isFull ? 'Complet' : 'S\'inscrire'} (TODO: GraphQL)
                </button>
              )}
            </>
          )}
          
          <button className="btn-secondary" disabled>
            <Share2 size={16} />
            Partager (TODO: GraphQL)
          </button>
          
          <button className="btn-secondary" disabled>
            <Bookmark size={16} />
            Sauvegarder (TODO: GraphQL)
          </button>
          
          {isOrganizer && (
            <button className="btn-secondary" disabled>
              <Settings size={16} />
              Gérer (TODO: GraphQL)
            </button>
          )}
        </div>
      </div>

      <div className="event-details-content">
        <div className="event-info-section">
          <h3>Description</h3>
          <p className="event-description">{event.description}</p>
          
          <div className="event-meta">
            <div className="meta-item">
              <Calendar size={20} />
              <div>
                <strong>Date et heure</strong>
                <p>{new Date(event.date).toLocaleString('fr-FR')}</p>
              </div>
            </div>
            
            <div className="meta-item">
              <MapPin size={20} />
              <div>
                <strong>Lieu</strong>
                <p>{event.location}</p>
              </div>
            </div>
            
            <div className="meta-item">
              <User size={20} />
              <div>
                <strong>Organisateur</strong>
                <p>{event.organizer.name}</p>
                <p className="organizer-email">
                  <Mail size={14} />
                  {event.organizer.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="participants-section">
          <div className="participants-header">
            <h3>
              <Users size={20} />
              Participants ({event.currentParticipants}/{event.maxParticipants})
            </h3>
            <span className="spots-indicator">
              {availableSpots > 0 ? (
                <span className="available">
                  {availableSpots} place{availableSpots > 1 ? 's' : ''} disponible{availableSpots > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="full">Complet</span>
              )}
            </span>
          </div>
          
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
              ></div>
            </div>

          <div className="participants-list">
            <div className="todo-section">
              <p>
                <strong>TODO GraphQL:</strong> Afficher la vraie liste des participants
              </p>
              <small>Les données ci-dessous sont factices pour la démonstration</small>
            </div>
            
            {mockParticipants.slice(0, event.currentParticipants).map((participant) => (
              <div key={participant.id} className="participant-item">
                <div className="participant-avatar">
                  <User size={16} />
                </div>
                <div className="participant-info">
                  <span className="participant-name">{participant.name}</span>
                  <span className="participant-email">{participant.email}</span>
                </div>
                {isOrganizer && (
                  <button className="btn-remove-participant" disabled>
                    <UserMinus size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;