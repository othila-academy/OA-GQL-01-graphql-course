import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Calendar, CheckCircle, Edit, Plus, Settings, Trash2, Users, X } from 'lucide-react';
import Modal from './Modal';
import UserManager from './UserManager';
import { useAuth } from '../auth';
import { CATEGORIES, CREATE_EVENT, DELETE_EVENT, EventCategory, EventsData, EventSummary, GET_EVENTS, UPDATE_EVENT } from '../queries';
import { CATEGORY_LABELS, formatDateRange } from '../lib/format';
import { evictEvent } from '../lib/cache';

interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  start: string;
  end: string;
}

const EMPTY_FORM: EventFormData = { title: '', description: '', category: 'TECH', start: '', end: '' };

/** Une description vidée part en chaîne vide : côté serveur, `null` signifie « inchangé ». */
export const toInput = (form: EventFormData) => ({
  title: form.title.trim(),
  description: form.description.trim(),
  category: form.category,
  dateRange: { start: form.start, end: form.end || form.start }
});

const toForm = (event: EventSummary): EventFormData => ({
  title: event.title,
  description: event.description ?? '',
  category: event.category,
  start: event.dateRange.start,
  end: event.dateRange.end
});

interface EventFormProps {
  idPrefix: string;
  value: EventFormData;
  onChange: (value: EventFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  busy: boolean;
  error: string | null;
}

const EventForm: React.FC<EventFormProps> = ({ idPrefix, value, onChange, onSubmit, onCancel, submitLabel, busy, error }) => {
  const set = (patch: Partial<EventFormData>) => onChange({ ...value, ...patch });
  return (
    <form onSubmit={onSubmit} className="event-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${idPrefix}-title`}>Titre *</label>
          <input id={`${idPrefix}-title`} value={value.title} onChange={(e) => set({ title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label htmlFor={`${idPrefix}-category`}>Catégorie *</label>
          <select id={`${idPrefix}-category`} value={value.category} onChange={(e) => set({ category: e.target.value as EventCategory })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor={`${idPrefix}-description`}>Description</label>
        <textarea id={`${idPrefix}-description`} rows={3} value={value.description} onChange={(e) => set({ description: e.target.value })} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${idPrefix}-start`}>Début *</label>
          <input id={`${idPrefix}-start`} type="date" value={value.start} onChange={(e) => set({ start: e.target.value })} required />
        </div>
        <div className="form-group">
          <label htmlFor={`${idPrefix}-end`}>Fin</label>
          <input id={`${idPrefix}-end`} type="date" value={value.end} onChange={(e) => set({ end: e.target.value })} />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={busy}><CheckCircle size={16} /> {submitLabel}</button>
        <button type="button" className="btn-cancel" onClick={onCancel}><X size={16} /> Annuler</button>
      </div>
    </form>
  );
};

const EventManager: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<EventsData>(GET_EVENTS, { variables: { limit: 50, offset: 0 } });
  const [createEvent, createState] = useMutation(CREATE_EVENT, { refetchQueries: 'active' });
  const [updateEvent, updateState] = useMutation(UPDATE_EVENT, { refetchQueries: 'active' });
  const [deleteEvent] = useMutation(DELETE_EVENT, {
    refetchQueries: 'active',
    // Sans éviction, la liste paginée garderait une carte fantôme (voir docs/SEANCE_4.md).
    update: (cache, _result, { variables }) => evictEvent(cache, variables?.id as string)
  });

  const [section, setSection] = useState<'events' | 'users'>('events');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [editing, setEditing] = useState<EventSummary | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  // Le serveur fait foi ; l'interface se contente de désactiver ce qui sera refusé.
  const canManage = (event: EventSummary) => !!user && (user.role === 'ADMIN' || user.id === event.organizer.id);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await createEvent({ variables: { input: toInput(form) } });
      setForm(EMPTY_FORM);
      setShowCreate(false);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setFormError(null);
    try {
      await updateEvent({ variables: { id: editing.id, input: toInput(form) } });
      setEditing(null);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    setListError(null);
    try {
      await deleteEvent({ variables: { id } });
    } catch (err) {
      setListError((err as Error).message);
    }
  };

  return (
    <div className="event-manager">
      <div className="manager-header">
        <h2><Settings size={20} /> Administration</h2>
        {!user && <span className="mock-data-indicator">Connectez-vous pour créer ou modifier</span>}
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${section === 'events' ? 'active' : ''}`} onClick={() => setSection('events')}><Calendar size={16} /> Événements</button>
        <button className={`admin-tab ${section === 'users' ? 'active' : ''}`} onClick={() => setSection('users')}><Users size={16} /> Utilisateurs</button>
      </div>

      {section === 'events' && (
        <div className="events-management">
          <div className="manager-actions">
            <button className="btn-create-event" disabled={!user} onClick={() => { setShowCreate((s) => !s); setFormError(null); }}>
              {showCreate ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Nouvel événement</>}
            </button>
          </div>

          {showCreate && (
            <div className="event-form-container">
              <h3>Créer un événement</h3>
              <EventForm idPrefix="create" value={form} onChange={setForm} onSubmit={submitCreate} onCancel={() => setShowCreate(false)} submitLabel="Créer" busy={createState.loading} error={formError} />
            </div>
          )}

          {loading && <div className="loading">Chargement…</div>}
          {error && <div className="error">Erreur : {error.message}</div>}
          {listError && <div className="error">{listError}</div>}

          <div className="events-management-list">
            <h3>Événements existants ({data?.events.length ?? 0})</h3>
            <div className="events-management-grid">
              {data?.events.map((event) => (
                <div key={event.id} className="event-management-card">
                  <div className="event-card-header">
                    <div>
                      <h4>{event.title}</h4>
                      <span className={`category-badge ${event.category.toLowerCase()}`}>{CATEGORY_LABELS[event.category]}</span>
                    </div>
                    <div className="event-actions-admin">
                      <button className="btn-icon btn-edit" disabled={!canManage(event)} title={canManage(event) ? 'Modifier' : "Réservé à l'organisateur ou à un ADMIN"} onClick={() => { setEditing(event); setForm(toForm(event)); setFormError(null); }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-delete" disabled={!canManage(event)} title={canManage(event) ? 'Supprimer' : "Réservé à l'organisateur ou à un ADMIN"} onClick={() => void remove(event.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {event.description && <p className="event-description">{event.description}</p>}
                  <div className="event-meta-mini">
                    <div className="meta-item"><Calendar size={14} /> {formatDateRange(event.dateRange)}</div>
                    <div className="meta-item"><Users size={14} /> {event.participants.length} · organisé par {event.organizer.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'users' && <UserManager />}

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title="Modifier l'événement" size="large">
        {editing && <EventForm idPrefix="edit" value={form} onChange={setForm} onSubmit={submitUpdate} onCancel={() => setEditing(null)} submitLabel="Enregistrer" busy={updateState.loading} error={formError} />}
      </Modal>
    </div>
  );
};

export default EventManager;
