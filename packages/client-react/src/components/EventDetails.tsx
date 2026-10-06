import React from 'react';
import { Calendar, Mail, Tag, User, Users } from 'lucide-react';
import RegisterButton from './RegisterButton';
import { EventSummary } from '../queries';
import { CATEGORY_LABELS, ROLE_LABELS, formatDateRange } from '../lib/format';

const EventDetails: React.FC<{ event: EventSummary }> = ({ event }) => (
  <div className="event-details">
    <div className="event-details-header">
      <div className="event-title-section">
        <h1>{event.title}</h1>
        <span className={`category-badge ${event.category.toLowerCase()}`}><Tag size={12} /> {CATEGORY_LABELS[event.category]}</span>
      </div>
      <div className="event-actions-header"><RegisterButton event={event} /></div>
    </div>

    <div className="event-details-content">
      <div className="event-info-section">
        <h3>Description</h3>
        <p className="event-description">{event.description ?? 'Pas de description.'}</p>
        <div className="event-meta">
          <div className="meta-item">
            <Calendar size={20} />
            <div><strong>Période</strong><p>{formatDateRange(event.dateRange)}</p></div>
          </div>
          <div className="meta-item">
            <User size={20} />
            <div>
              <strong>Organisateur</strong>
              <p>{event.organizer.name} · {ROLE_LABELS[event.organizer.role]}</p>
              <p className="organizer-email"><Mail size={14} /> {event.organizer.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="participants-section">
        <div className="participants-header">
          <h3><Users size={20} /> Participants ({event.participants.length})</h3>
        </div>
        <div className="participants-list">
          {event.participants.length === 0 && <p>Aucun participant pour le moment.</p>}
          {event.participants.map((p) => (
            <div key={p.id} className="participant-item">
              <div className="participant-avatar"><User size={16} /></div>
              <div className="participant-info">
                <span className="participant-name">{p.name}</span>
                <span className="participant-email">{p.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default EventDetails;
