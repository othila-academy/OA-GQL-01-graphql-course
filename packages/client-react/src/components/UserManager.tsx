import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  User,
  Mail,
  Shield,
  CheckCircle,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import Modal from './Modal';

// TODO: Définir les interfaces TypeScript pour les utilisateurs
interface UserFormData {
  name: string;
  email: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  eventsOrganized: number;
  eventsAttended: number;
  joinDate: string;
}

interface UserManagerProps {
  onUserCreated?: () => void;
  onUserUpdated?: () => void;
  onUserDeleted?: () => void;
}

const UserManager: React.FC<UserManagerProps> = ({ 
  onUserCreated, 
  onUserUpdated, 
  onUserDeleted 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Participant'
  });

  // TODO: Récupérer les utilisateurs via GraphQL
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

  const roles = ['Participant', 'Organisateur', 'Administrateur'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Remplacer par une vraie mutation GraphQL
    console.log('Simulation - Création utilisateur:', formData);
    
    try {
      // TODO: Utiliser la mutation GraphQL CREATE_USER
      alert('✅ Utilisateur créé avec succès ! (Simulation - TODO: GraphQL)');
      
      // Reset du formulaire
      setFormData({
        name: '',
        email: '',
        role: 'Participant'
      });
      setShowCreateForm(false);
      
      if (onUserCreated) {
        onUserCreated();
      }
      
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('❌ Erreur lors de la création (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Remplacer par une vraie mutation GraphQL
    console.log('Simulation - Modification utilisateur:', editingUser?.id, formData);
    
    try {
      alert('✅ Utilisateur modifié avec succès ! (Simulation - TODO: GraphQL)');
      setShowEditModal(false);
      setEditingUser(null);
      
      if (onUserUpdated) {
        onUserUpdated();
      }
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('❌ Erreur lors de la modification (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }
    
    // TODO: Remplacer par une vraie mutation GraphQL
    console.log('Simulation - Suppression utilisateur:', userId);
    
    try {
      alert('✅ Utilisateur supprimé avec succès ! (Simulation - TODO: GraphQL)');
      
      if (onUserDeleted) {
        onUserDeleted();
      }
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression (TODO: Gérer les erreurs GraphQL)');
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h3>
          <Users size={20} />
          Gestion des Utilisateurs
        </h3>
        <span className="mock-data-indicator">Interface factice - TODO: GraphQL</span>
      </div>

      <div className="manager-actions">
        <button 
          className="btn-create-user"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? (
            <>
              <X size={16} />
              Annuler
            </>
          ) : (
            <>
              <Plus size={16} />
              Nouvel Utilisateur
            </>
          )}
        </button>
        
        <div className="user-filters">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter size={16} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les rôles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="user-form-container">
          <h4>Créer un nouvel utilisateur</h4>
          <p className="form-help">
            💡 Ce formulaire est fonctionnel mais utilise des données factices.
          </p>
          
          <form onSubmit={handleCreateUser} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} />
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ex: jean.dupont@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <Shield size={16} />
                Rôle *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                <CheckCircle size={16} />
                Créer l'utilisateur
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowCreateForm(false)}
              >
                <X size={16} />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-table">
        <div className="table-header">
          <h4>Utilisateurs ({filteredUsers.length})</h4>
        </div>
        
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user.id} className="user-management-card">
              <div className="user-card-header">
                <div className="user-info">
                  <div className="user-avatar">
                    <User size={20} />
                  </div>
                  <div>
                    <h5>{user.name}</h5>
                    <p>{user.email}</p>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                
                <div className="user-actions">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => handleEditUser(user)}
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="user-stats-mini">
                <div className="stat-mini">
                  <span>{user.eventsOrganized}</span>
                  <small>Organisés</small>
                </div>
                <div className="stat-mini">
                  <span>{user.eventsAttended}</span>
                  <small>Participés</small>
                </div>
                <div className="stat-mini">
                  <span>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
                  <small>Inscription</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de modification */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Modifier l'utilisateur"
        size="medium"
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="user-form">
            <div className="form-group">
              <label htmlFor="edit-name">
                <User size={16} />
                Nom complet *
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-email">
                <Mail size={16} />
                Email *
              </label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-role">
                <Shield size={16} />
                Rôle *
              </label>
              <select
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
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
    </div>
  );
};

export default UserManager;