import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Calendar, Eye, Tag, User, Users } from 'lucide-react';
import Modal from './Modal';
import EventDetails from './EventDetails';
import RegisterButton from './RegisterButton';
import { EventsData, GET_EVENTS } from '../queries';
import { CATEGORY_LABELS, formatDateRange } from '../lib/format';

const PAGE_SIZE = 6;

const EventsList: React.FC = () => {
  const { loading, error, data, fetchMore } = useQuery<EventsData>(GET_EVENTS, { variables: { limit: PAGE_SIZE, offset: 0 } });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (loading) return <div className="loading">Chargement des événements…</div>;
  if (error) return <div className="error">Erreur : {error.message}</div>;

  const events = data?.events ?? [];
  // On garde l'id plutôt que l'objet : la modale suit les rafraîchissements du cache.
  const selected = events.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="events-list">
      <div className="section-header">
        <h2><Calendar size={20} /> Événements</h2>
        <span className="todo-badge">{events.length} événement{events.length > 1 ? 's' : ''}</span>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <span className={`category-badge ${event.category.toLowerCase()}`}><Tag size={12} /> {CATEGORY_LABELS[event.category]}</span>
            </div>
            {event.description && <p className="event-description">{event.description}</p>}
            <div className="event-details">
              <div className="detail-item"><Calendar size={16} /><span>{formatDateRange(event.dateRange)}</span></div>
              <div className="detail-item"><User size={16} /><span>{event.organizer.name}</span></div>
              <div className="detail-item"><Users size={16} /><span>{event.participants.length} participant{event.participants.length > 1 ? 's' : ''}</span></div>
            </div>
            <div className="event-actions">
              <RegisterButton event={event} />
              <button className="btn-secondary" onClick={() => setSelectedId(event.id)}><Eye size={16} /> Détails</button>
            </div>
          </div>
        ))}
      </div>

      {data && events.length < data.eventsCount && (
        <div className="event-actions">
          <button className="btn-secondary" onClick={() => void fetchMore({ variables: { offset: events.length } })}>
            Charger plus ({events.length}/{data.eventsCount})
          </button>
        </div>
      )}

      <Modal isOpen={selected !== null} onClose={() => setSelectedId(null)} title="Détails de l'événement" size="large">
        {selected && <EventDetails event={selected} />}
      </Modal>
    </div>
  );
};

export default EventsList;
