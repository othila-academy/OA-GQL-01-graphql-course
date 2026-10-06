import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  X, 
  BarChart3, 
  Bell,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Type,
  FileText,
  Hash,
  Target,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import Modal from './Modal';
import UserManager from './UserManager';
// TODO: Importer useMutation depuis @apollo/client
// import { useMutation } from '@apollo/client';
// TODO: Importer vos mutations GraphQL depuis '../queries'
// import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from '../queries';

// TODO: Définir les interfaces TypeScript pour le formulaire
interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  category: string;
}

interface Event {
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
}

interface EventManagerProps {
  onEventCreated?: () => void;
  onEventUpdated?: () => void;
  onEventDeleted?: () => void;
}

const EventManager: React.FC<EventManagerProps> = ({ 
  onEventCreated, 
  onEventUpdated, 
  onEventDeleted 
}) => {
  // TODO: Utiliser useMutation pour créer/modifier/supprimer des événements
  // const [createEvent] = useMutation(CREATE_EVENT);
  // const [updateEvent] = useMutation(UPDATE_EVENT);
  // const [deleteEvent] = useMutation(DELETE_EVENT);

  const [activeSection, setActiveSection] = useState<'events' | 'users'>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningEvent, setAssigningEvent] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: 50,
    category: 'Workshop'
  });

  // TODO: Récupérer les événements via GraphQL
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Workshop GraphQL pour débutants',
      description: 'Apprenez les bases de GraphQL avec des exercices pratiques.',
      date: '2025-10-15T14:00',
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
      date: '2025-11-20T09:00',
      location: 'Lyon, France',
      maxParticipants: 100,
      currentParticipants: 45,
      category: 'Conférence',
      organizer: { 
        id: '2', 
        name: 'Bob Martin', 
        email: 'bob.martin@example.com' 
      }
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Remplacer cette simulation par une vraie mutation GraphQL
    console.log('Simulation - Données à envoyer via GraphQL:', formData);
    
    try {
      // TODO: Utiliser la mutation GraphQL
      // await createEvent({ 
      //   variables: { 
      //     input: formData 
      //   } 
      // });
      
      // Simulation d'une création réussie
      alert('✅ Événement créé avec succès ! (Simulation - TODO: GraphQL)');
      
      // Reset du formulaire
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        maxParticipants: 50,
        category: 'Workshop'
      });
      setShowEventForm(false);
      
      // Callback pour rafraîchir la liste
      if (onEventCreated) {
        onEventCreated();
      }
      
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('❌ Erreur lors de la création (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Simulation - Modification événement:', editingEvent?.id, formData);
    
    try {
      alert('✅ Événement modifié avec succès ! (Simulation - TODO: GraphQL)');
      setShowEditModal(false);
      setEditingEvent(null);
      
      if (onEventUpdated) {
        onEventUpdated();
      }
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('❌ Erreur lors de la modification (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }
    
    console.log('Simulation - Suppression événement:', eventId);
    
    try {
      alert('✅ Événement supprimé avec succès ! (Simulation - TODO: GraphQL)');
      
      if (onEventDeleted) {
        onEventDeleted();
      }
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const handleAssignUsers = (event: Event) => {
    setAssigningEvent(event);
    setShowAssignModal(true);
  };

  const categories = ['Workshop', 'Conférence', 'Hackathon', 'Meetup', 'Formation'];

  return (
    <div className="event-manager">
      <div className="manager-header">
        <h2>
          <Settings size={20} />
          Administration
        </h2>
        <span className="mock-data-indicator">Interface factice - TODO: GraphQL</span>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeSection === 'events' ? 'active' : ''}`}
          onClick={() => setActiveSection('events')}
        >
          <Calendar size={16} />
          Gestion des Événements
        </button>
        <button 
          className={`admin-tab ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          <Users size={16} />
          Gestion des Utilisateurs
        </button>
      </div>

      {activeSection === 'events' && (
        <div className="events-management">
          <div className="manager-actions">
            <button 
              className="btn-create-event"
              onClick={() => setShowEventForm(!showEventForm)}
            >
              {showEventForm ? (
                <>
                  <X size={16} />
                  Annuler
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Nouvel Événement
                </>
              )}
            </button>
            
            <div className="admin-actions">
              <button className="btn-secondary" disabled>
                <BarChart3 size={16} />
                Statistiques (TODO: GraphQL)
              </button>
              <button className="btn-secondary" disabled>
                <Bell size={16} />
                Notifications (TODO: GraphQL)
              </button>
            </div>
          </div>

          {showEventForm && (
            <div className="event-form-container">
              <h3>Créer un nouvel événement</h3>
              <p className="form-help">
                💡 Ce formulaire est fonctionnel mais utilise des données factices. 
                Les étudiants devront l'intégrer avec GraphQL.
              </p>
              
              <form onSubmit={handleSubmit} className="event-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">
                      <Type size={16} />
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Workshop GraphQL Avancé"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="category">
                      <Hash size={16} />
                      Catégorie *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    <FileText size={16} />
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre événement..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">
                      <Calendar size={16} />
                      Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="maxParticipants">
                      <Users size={16} />
                      Nb. max participants
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    <MapPin size={16} />
                    Lieu *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Paris, France ou En ligne"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    <CheckCircle size={16} />
                    Créer l'événement (Simulation)
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowEventForm(false)}
                  >
                    <X size={16} />
                    Annuler
                  </button>
                </div>
                
                <div className="form-todo">
                  <h4>
                    <Target size={16} />
                    TODOs pour les étudiants :
                  </h4>
                  <ul>
                    <li>Créer la mutation CREATE_EVENT dans queries.ts</li>
                    <li>Remplacer la simulation par useMutation</li>
                    <li>Gérer les erreurs et le loading state</li>
                    <li>Ajouter la validation côté serveur</li>
                    <li>Implémenter la modification et suppression</li>
                  </ul>
                </div>
              </form>
            </div>
          )}

          {/* Liste des événements existants */}
          <div className="events-management-list">
            <h3>Événements existants ({mockEvents.length})</h3>
            <div className="events-management-grid">
              {mockEvents.map((event) => (
                <div key={event.id} className="event-management-card">
                  <div className="event-card-header">
                    <div>
                      <h4>{event.title}</h4>
                      <span className={`category-badge ${event.category.toLowerCase()}`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="event-actions-admin">
                      <button 
                        className="btn-icon btn-edit"
                        onClick={() => handleEditEvent(event)}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-assign"
                        onClick={() => handleAssignUsers(event)}
                        title="Gérer les participants"
                      >
                        <UserPlus size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteEvent(event.id)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-meta-mini">
                    <div className="meta-item">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="meta-item">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                    <div className="meta-item">
                      <Users size={14} />
                      {event.currentParticipants}/{event.maxParticipants}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <UserManager 
          onUserCreated={() => console.log('User created')}
          onUserUpdated={() => console.log('User updated')}
          onUserDeleted={() => console.log('User deleted')}
        />
      )}

      {/* Modal de modification d'événement */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEvent(null);
        }}
        title="Modifier l'événement"
        size="large"
      >
        {editingEvent && (
          <form onSubmit={handleUpdateEvent} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-title">
                  <Type size={16} />
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-category">
                  <Hash size={16} />
                  Catégorie *
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">
                <FileText size={16} />
                Description *
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-date">
                  <Calendar size={16} />
                  Date *
                </label>
                <input
                  type="datetime-local"
                  id="edit-date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-maxParticipants">
                  <Users size={16} />
                  Nb. max participants
                </label>
                <input
                  type="number"
                  id="edit-maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-location">
                <MapPin size={16} />
                Lieu *
              </label>
              <input
                type="text"
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                <CheckCircle size={16} />
                Sauvegarder
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                <X size={16} />
                Annuler
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal d'assignation d'utilisateurs */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setAssigningEvent(null);
        }}
        title="Gérer les participants"
        size="large"
      >
        {assigningEvent && (
          <div className="assign-users-content">
            <h3>Événement: {assigningEvent.title}</h3>
            <p>TODO: Interface d'assignation d'utilisateurs à implémenter avec GraphQL</p>
            <div className="todo-section">
              <h4>Fonctionnalités à développer:</h4>
              <ul>
                <li>Liste des utilisateurs disponibles</li>
                <li>Liste des participants actuels</li>
                <li>Boutons d'ajout/suppression de participants</li>
                <li>Recherche et filtres d'utilisateurs</li>
                <li>Gestion des rôles (participant, co-organisateur)</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventManager;