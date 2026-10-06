import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Plus,
  Search,
  Filter
} from 'lucide-react';

export type TabType = 'dashboard' | 'events' | 'users' | 'management';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Vue d\'ensemble'
    },
    {
      id: 'events' as TabType,
      label: 'Événements',
      icon: Calendar,
      description: 'Gérer les événements'
    },
    {
      id: 'users' as TabType,
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gérer les utilisateurs'
    },
    {
      id: 'management' as TabType,
      label: 'Administration',
      icon: Settings,
      description: 'Outils d\'admin'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-brand">
          <Calendar className="brand-icon" />
          <span className="brand-text">EventHub</span>
          <span className="brand-subtitle">GraphQL Course</span>
        </div>
        
        <div className="nav-search">
          <input
            type="text"
            placeholder="Rechercher... (TODO: GraphQL)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            disabled
          />
          <button className="filter-btn" disabled>
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="nav-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <IconComponent size={20} />
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      
    </nav>
  );
};

export default Navigation;