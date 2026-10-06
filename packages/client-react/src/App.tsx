import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import Navigation, { TabType } from './components/Navigation';
import Dashboard from './components/Dashboard';
import EventsList from './components/EventsList';
import UsersList from './components/UsersList';
import EventManager from './components/EventManager';
import client from './apollo-client';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // TODO: Le client Apollo est importé depuis apollo-client.ts
  // TODO: Assurez-vous que la configuration Apollo est correcte avant d'utiliser l'application

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventsList />;
      case 'users':
        return <UsersList />;
      case 'management':
        return <EventManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>🚀 GraphQL Course - Event Platform</h1>
          <p>Apprenez GraphQL avec React et Apollo Client !</p>
        </header>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="App-main">
          {/* Section pédagogique améliorée */}
          <div className="course-info">
            <div className="course-header">
              <h2>🎯 Objectifs du TP</h2>
              <div className="course-status">
                <span className="status-badge learning">Mode Apprentissage</span>
              </div>
            </div>
            
            <div className="course-content">
              <div className="course-description">
                <p>
                  Cette interface présente une <strong>plateforme complète de gestion d'événements</strong> 
                  utilisant des données factices pour vous permettre de voir le résultat final attendu.
                </p>
                <p>
                  <strong>Votre mission :</strong> Intégrer GraphQL pour remplacer les données factices 
                  par de vraies requêtes et mutations !
                </p>
              </div>
              
              <div className="course-features">
                <h3>✨ Fonctionnalités à implémenter</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <div>
                      <strong>Dashboard</strong>
                      <small>Statistiques temps réel</small>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📅</span>
                    <div>
                      <strong>Événements</strong>
                      <small>CRUD complet avec participants</small>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👥</span>
                    <div>
                      <strong>Utilisateurs</strong>
                      <small>Gestion et profils</small>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⚙️</span>
                    <div>
                      <strong>Administration</strong>
                      <small>Interface complète</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="course-indicators">
              <div className="indicator-item">
                <span className="todo-badge">TODO GraphQL à implémenter</span>
                <small>Fonctionnalités à développer</small>
              </div>
              <div className="indicator-item">
                <span className="mock-badge">Données factices</span>
                <small>Interface de démonstration</small>
              </div>
            </div>
          </div>

          <div className="main-content">
            {renderContent()}
          </div>
          
          {/* Section d'aide pour les étudiants */}
          <div className="student-help">
            <h3>💡 Prochaines étapes</h3>
            <ul>
              <li>Configurez Apollo Client dans <code>apollo-client.ts</code></li>
              <li>Définissez vos requêtes GraphQL dans <code>queries.ts</code></li>
              <li>Remplacez les données factices par useQuery dans les composants</li>
              <li>Implémentez les interactions entre utilisateurs et événements</li>
            </ul>
          </div>
        </main>
        
        <footer className="App-footer">
          <p>🎓 Othila Academy - GraphQL Course</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
