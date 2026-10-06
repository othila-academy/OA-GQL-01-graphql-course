import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Eye, Mail, Users } from 'lucide-react';
import Modal from './Modal';
import UserDetails from './UserDetails';
import { GET_USERS, UsersData } from '../queries';
import { ROLE_LABELS, initials } from '../lib/format';

const UsersList: React.FC = () => {
  const { loading, error, data } = useQuery<UsersData>(GET_USERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading) return <div className="loading">Chargement des utilisateurs…</div>;
  if (error) return <div className="error">Erreur : {error.message}</div>;

  const users = data?.users ?? [];

  return (
    <div className="users-list">
      <div className="section-header">
        <h2><Users size={20} /> Utilisateurs</h2>
        <span className="todo-badge">{users.length} membre{users.length > 1 ? 's' : ''}</span>
      </div>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar"><span className="avatar-text">{initials(user.name)}</span></div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <span className={`role-badge ${user.role.toLowerCase()}`}>{ROLE_LABELS[user.role]}</span>
              </div>
            </div>
            <div className="user-details">
              <div className="detail-item"><Mail size={14} /><span>{user.email}</span></div>
            </div>
            <div className="user-actions">
              <button className="btn-secondary" onClick={() => setSelectedId(user.id)}><Eye size={16} /> Profil</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={selectedId !== null} onClose={() => setSelectedId(null)} title="Profil utilisateur" size="large">
        {selectedId && <UserDetails userId={selectedId} />}
      </Modal>
    </div>
  );
};

export default UsersList;
