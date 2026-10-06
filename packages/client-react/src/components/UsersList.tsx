import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  Search, 
  Filter,
  User,
  MessageCircle,
  Eye,
  Award,
  Activity
} from 'lucide-react';
import Modal from './Modal';
import UserDetails from './UserDetails';
// TODO: Importer useQuery depuis @apollo/client
// import { useQuery } from '@apollo/client';
// TODO: Importer votre requête GraphQL depuis '../queries'
// import { GET_USERS } from '../queries';

// TODO: Définir l'interface TypeScript pour les utilisateurs
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  eventsOrganized: number;
  eventsAttended: number;
  joinDate: string;
  // TODO: Ajouter d'autres champs si nécessaire (avatar, bio, etc.)
}

interface UsersData {
  users: User[];
}

const UsersList: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // TODO: Utiliser useQuery pour récupérer les utilisateurs
  // const { loading, error, data } = useQuery<UsersData>(GET_USERS);

  // TODO: Gérer les états de loading et d'erreur
  // if (loading) return <div className="loading">Loading users...</div>;
  // if (error) return <div className="error">Error: {error.message}</div>;

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    // TODO: Implémenter l'envoi de message via GraphQL
    console.log('TODO: Envoi message GraphQL');
  };

  // Données factices pour le développement - TODO: Remplacer par les vraies données GraphQL
  const mockUsers: User[] = [
    { 
      id: '1', 
      name: 'Alice Dupont',
      email: 'alice.dupont@example.com',
      role: 'Organisateur',
      eventsOrganized: 5,
      eventsAttended: 12,
      joinDate: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'Bob Martin',
      email: 'bob.martin@example.com',
      role: 'Participant',
      eventsOrganized: 2,
      eventsAttended: 8,
      joinDate: '2024-03-22'
    },
    { 
      id: '3', 
      name: 'Claire Durand',
      email: 'claire.durand@example.com',
      role: 'Organisateur',
      eventsOrganized: 3,
      eventsAttended: 15,
      joinDate: '2023-11-08'
    },
    { 
      id: '4', 
      name: 'David Leroy',
      email: 'david.leroy@example.com',
      role: 'Participant',
      eventsOrganized: 0,
      eventsAttended: 4,
      joinDate: '2024-06-12'
    }
  ];

  return (
    <div className="users-list">
      <div className="section-header">
        <h2>
          <Users size={20} />
          Utilisateurs
        </h2>
        <span className="mock-data-indicator">Données factices - TODO: GraphQL</span>
      </div>
      
      {/* TODO: Ajouter ici des filtres pour les utilisateurs avec GraphQL */}
      <div className="filters-placeholder">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur... (TODO: GraphQL)"
            className="search-input"
            disabled
          />
        </div>
        <div className="filter-container">
          <Filter size={16} />
          <select className="filter-select" disabled>
            <option>Tous les rôles (TODO: GraphQL)</option>
          </select>
        </div>
      </div>

      <div className="users-grid">
        {/* TODO: Remplacer mockUsers par data?.users */}
        {mockUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                <User size={20} />
                <span className="avatar-text">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <span className={`role-badge ${user.role.toLowerCase().replace(' ', '-')}`}>
                  {user.role === 'Organisateur' ? <Award size={12} /> : <Activity size={12} />}
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="user-details">
              <div className="detail-item">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <Calendar size={14} />
                <span>Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
              </div>
              
              <div className="user-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <Award size={16} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{user.eventsOrganized}</span>
                    <span className="stat-label">Organisés</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Activity size={16} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{user.eventsAttended}</span>
                    <span className="stat-label">Participés</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-actions">
              <button className="btn-primary" disabled>
                <MessageCircle size={16} />
                Contacter (TODO: GraphQL)
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => handleViewProfile(user)}
              >
                <Eye size={16} />
                Profil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour les détails de l'utilisateur */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Profil utilisateur"
        size="large"
      >
        {selectedUser && (
          <UserDetails
            user={selectedUser}
            currentUser={{ id: 'current-user', name: 'Utilisateur actuel' }}
            isCurrentUser={false}
            onSendMessage={handleSendMessage}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersList;