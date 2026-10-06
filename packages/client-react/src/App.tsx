import React, { useState } from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import Navigation, { TabType } from './components/Navigation';
import Dashboard from './components/Dashboard';
import EventsList from './components/EventsList';
import UsersList from './components/UsersList';
import EventManager from './components/EventManager';
import defaultClient, { GRAPHQL_URL } from './apollo-client';
import { AuthProvider } from './auth';
import './App.css';

interface AppProps {
  client?: ApolloClient<NormalizedCacheObject>;
}

function App({ client = defaultClient }: AppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const content: Record<TabType, React.ReactNode> = {
    dashboard: <Dashboard />,
    events: <EventsList />,
    users: <UsersList />,
    management: <EventManager />
  };

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <div className="App">
          <header className="App-header">
            <h1>🚀 GraphQL Course - Event Platform</h1>
            <p>Client React branché sur {GRAPHQL_URL}</p>
          </header>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="App-main">
            <div className="main-content">{content[activeTab]}</div>

            <div className="student-help">
              <h3>💡 Pour aller plus loin</h3>
              <ul>
                <li>Brancher la barre de recherche sur la query <code>search</code> (union User | Event).</li>
                <li>Gérer les participants d'un événement depuis l'administration.</li>
                <li>Afficher une réponse optimiste lors de l'inscription à un événement.</li>
                <li>Les consignes complètes sont dans <code>docs/SEANCE_3.md</code>.</li>
              </ul>
            </div>
          </main>

          <footer className="App-footer">
            <p>🎓 Othila Academy - GraphQL Course</p>
          </footer>
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
