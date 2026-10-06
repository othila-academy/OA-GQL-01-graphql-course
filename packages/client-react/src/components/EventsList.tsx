import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  Search, 
  Filter,
  UserPlus,
  Eye
} from 'lucide-react';
import Modal from './Modal';
import EventDetails from './EventDetails';
// TODO: Importer useQuery depuis @apollo/client
// import { useQuery } from '@apollo/client';
// TODO: Importer votre requête GraphQL depuis '../queries'
// import { GET_EVENTS } from '../queries';

// TODO: Définir les interfaces TypeScript pour vos données
interface User {
  id: string;
  name: string;
  email: string;
  // TODO: Ajouter d'autres champs si nécessaire (role, avatar, etc.)
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: User;
  category: string;
  // TODO: Ajouter d'autres champs si nécessaire (tags, price, etc.)
}

interface EventsData {
  events: Event[];
}

const EventsList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // TODO: Utiliser useQuery pour récupérer les événements
  // const { loading, error, data } = useQuery<EventsData>(GET_EVENTS);

  // TODO: Gérer les états de loading et d'erreur
  // if (loading) return <div className="loading">Loading events...</div>;
  // if (error) return <div className="error">Error: {error.message}</div>;

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleRegister = () => {
    // TODO: Implémenter l'inscription via GraphQL
    console.log('TODO: Inscription GraphQL');
  };

  // Données factices pour le développement - TODO: Remplacer par les vraies données GraphQL
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Workshop GraphQL pour débutants',
      description: 'Apprenez les bases de GraphQL avec des exercices pratiques.',
      date: '2025-10-15',
      location: 'Paris, France',
      maxParticipants: 30,
      currentParticipants: 18,
      category: 'Workshop',
      organizer: { 
        id: '1', 
        name: 'Alice Dupont', 
        email: 'alice.dupont@example.com' 
      }
    },
    {
      id: '2',
      title: 'Conférence React + GraphQL',
      description: 'Découvrez comment intégrer GraphQL dans vos applications React.',
      date: '2025-11-20',
      location: 'Lyon, France',
      maxParticipants: 100,
      currentParticipants: 45,
      category: 'Conférence',
      organizer: { 
        id: '2', 
        name: 'Bob Martin', 
        email: 'bob.martin@example.com' 
      }
    },
    {
      id: '3',
      title: 'Hackathon GraphQL',
      description: 'Un weekend pour créer des applications innovantes avec GraphQL.',
      date: '2025-12-05',
      location: 'Marseille, France',
      maxParticipants: 50,
      currentParticipants: 23,
      category: 'Hackathon',
      organizer: { 
        id: '3', 
        name: 'Claire Durand', 
        email: 'claire.durand@example.com' 
      }
    }
  ];

  return (
    <div className="events-list">
      <div className="section-header">
        <h2>
          <Calendar size={20} />
          Événements
        </h2>
        <span className="mock-data-indicator">Données factices - TODO: GraphQL</span>
      </div>
      
      {/* TODO: Ajouter ici des filtres et recherche avec GraphQL */}
      <div className="filters-placeholder">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un événement... (TODO: GraphQL)"
            className="search-input"
            disabled
          />
        </div>
        <div className="filter-container">
          <Filter size={16} />
          <select className="filter-select" disabled>
            <option>Toutes les catégories (TODO: GraphQL)</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {/* TODO: Remplacer mockEvents par data?.events */}
        {mockEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <span className={`category-badge ${event.category.toLowerCase()}`}>
                {event.category}
              </span>
            </div>
            
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="detail-item">
                <Calendar size={16} />
                <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="detail-item">
                <User size={16} />
                <span>{event.organizer.name}</span>
              </div>
              
              <div className="participants-info">
                <div className="participants-header">
                  <Users size={16} />
                  <span className="participants-text">
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </span>
                </div>
                <div className="participants-bar">
                  <div 
                    className="participants-progress" 
                    style={{ 
                      width: `${(event.currentParticipants / event.maxParticipants) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="event-actions">
              <button className="btn-primary" disabled>
                <UserPlus size={16} />
                S'inscrire (TODO: GraphQL)
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => handleViewDetails(event)}
              >
                <Eye size={16} />
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour les détails de l'événement */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Détails de l'événement"
        size="large"
      >
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            currentUser={{ id: 'current-user', name: 'Utilisateur actuel' }}
            isRegistered={false}
            onRegister={handleRegister}
          />
        )}
      </Modal>
    </div>
  );
};

export default EventsList;