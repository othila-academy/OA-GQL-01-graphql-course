import React, { useState } from 'react';
import { BarChart3, Calendar, Filter, LogIn, LogOut, Settings, Users } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../auth';
import { ROLE_LABELS } from '../lib/format';

export type TabType = 'dashboard' | 'events' | 'users' | 'management';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; icon: typeof Calendar; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: "Vue d'ensemble" },
  { id: 'events', label: 'Événements', icon: Calendar, description: "Parcourir et s'inscrire" },
  { id: 'users', label: 'Utilisateurs', icon: Users, description: 'Annuaire' },
  { id: 'management', label: 'Administration', icon: Settings, description: 'Créer, modifier, supprimer' }
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-brand">
          <Calendar className="brand-icon" />
          <span className="brand-text">EventHub</span>
          <span className="brand-subtitle">GraphQL Course</span>
        </div>

        {/* Défi : brancher cette recherche sur la query `search` (union User | Event). */}
        <div className="nav-search">
          <input type="text" placeholder="Rechercher… (défi : query search)" className="search-input" disabled />
          <button className="filter-btn" disabled><Filter size={16} /></button>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className={`role-badge ${user.role.toLowerCase()}`}>{user.name} · {ROLE_LABELS[user.role]}</span>
              <button className="btn-secondary" onClick={() => void logout()}><LogOut size={16} /> Déconnexion</button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setLoginOpen(true)}><LogIn size={16} /> Connexion</button>
          )}
        </div>
      </div>

      <div className="nav-tabs">
        {TABS.map(({ id, label, icon: Icon, description }) => (
          <button key={id} className={`nav-tab ${activeTab === id ? 'active' : ''}`} onClick={() => onTabChange(id)}>
            <Icon size={20} />
            <div className="tab-content">
              <span className="tab-label">{label}</span>
              <span className="tab-description">{description}</span>
            </div>
          </button>
        ))}
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
};

export default Navigation;
