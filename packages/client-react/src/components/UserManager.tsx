import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CheckCircle, Edit, Plus, Trash2, User, Users, X } from 'lucide-react';
import Modal from './Modal';
import { useAuth } from '../auth';
import { CREATE_USER, DELETE_USER, GET_USERS, ROLES, Role, UPDATE_USER, UserInfo, UsersData } from '../queries';
import { ROLE_LABELS } from '../lib/format';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const EMPTY_FORM: UserFormData = { name: '', email: '', password: '', role: 'STUDENT' };

const UserManager: React.FC = () => {
  const { user: me } = useAuth();
  const isAdmin = me?.role === 'ADMIN';
  const { data, loading, error } = useQuery<UsersData>(GET_USERS);
  const [createUser, createState] = useMutation(CREATE_USER, { refetchQueries: 'active' });
  const [updateUser, updateState] = useMutation(UPDATE_USER, { refetchQueries: 'active' });
  const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: 'active' });

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);
  const [editing, setEditing] = useState<UserInfo | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const set = (patch: Partial<UserFormData>) => setForm((f) => ({ ...f, ...patch }));
  const canEdit = (u: UserInfo) => isAdmin || me?.id === u.id;

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const input: Record<string, unknown> = { name: form.name.trim(), email: form.email.trim(), password: form.password };
      if (isAdmin) input.role = form.role;
      await createUser({ variables: { input } });
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
      const input: Record<string, unknown> = { name: form.name.trim(), email: form.email.trim() };
      if (isAdmin) input.role = form.role;
      await updateUser({ variables: { id: editing.id, input } });
      setEditing(null);
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    setListError(null);
    try {
      await deleteUser({ variables: { id } });
    } catch (err) {
      setListError((err as Error).message);
    }
  };

  const users = (data?.users ?? []).filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  const fields = (idPrefix: string, withPassword: boolean) => (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${idPrefix}-name`}>Nom *</label>
          <input id={`${idPrefix}-name`} value={form.name} onChange={(e) => set({ name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label htmlFor={`${idPrefix}-email`}>Email *</label>
          <input id={`${idPrefix}-email`} type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} required />
        </div>
      </div>
      {withPassword && (
        <div className="form-group">
          <label htmlFor={`${idPrefix}-password`}>Mot de passe * (8 caractères minimum)</label>
          <input id={`${idPrefix}-password`} type="password" minLength={8} value={form.password} onChange={(e) => set({ password: e.target.value })} required />
        </div>
      )}
      {isAdmin && (
        <div className="form-group">
          <label htmlFor={`${idPrefix}-role`}>Rôle</label>
          <select id={`${idPrefix}-role`} value={form.role} onChange={(e) => set({ role: e.target.value as Role })}>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>
      )}
      {formError && <div className="error">{formError}</div>}
    </>
  );

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h3><Users size={20} /> Gestion des utilisateurs</h3>
        {!isAdmin && <span className="mock-data-indicator">Seul un ADMIN change les rôles et supprime</span>}
      </div>

      <div className="manager-actions">
        <button className="btn-create-user" onClick={() => { setShowCreate((s) => !s); setFormError(null); }}>
          {showCreate ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Nouvel utilisateur</>}
        </button>
        <div className="user-filters">
          <div className="search-container">
            <input className="search-input" placeholder="Filtrer (nom ou email)" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="user-form-container">
          <h4>Créer un utilisateur</h4>
          <form onSubmit={submitCreate} className="user-form">
            {fields('create', true)}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={createState.loading}><CheckCircle size={16} /> Créer</button>
              <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}><X size={16} /> Annuler</button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="loading">Chargement…</div>}
      {error && <div className="error">Erreur : {error.message}</div>}
      {listError && <div className="error">{listError}</div>}

      <div className="users-table">
        <div className="table-header"><h4>Utilisateurs ({users.length})</h4></div>
        <div className="users-grid">
          {users.map((u) => (
            <div key={u.id} className="user-management-card">
              <div className="user-card-header">
                <div className="user-info">
                  <div className="user-avatar"><User size={20} /></div>
                  <div>
                    <h5>{u.name}</h5>
                    <p>{u.email}</p>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>{ROLE_LABELS[u.role]}</span>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="btn-icon btn-edit" disabled={!canEdit(u)} title={canEdit(u) ? 'Modifier' : 'Réservé à soi-même ou à un ADMIN'} onClick={() => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setFormError(null); }}>
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon btn-delete" disabled={!isAdmin} title={isAdmin ? 'Supprimer' : 'Réservé aux ADMIN'} onClick={() => void remove(u.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title="Modifier l'utilisateur" size="medium">
        {editing && (
          <form onSubmit={submitUpdate} className="user-form">
            {fields('edit', false)}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={updateState.loading}><CheckCircle size={16} /> Enregistrer</button>
              <button type="button" className="btn-cancel" onClick={() => setEditing(null)}><X size={16} /> Annuler</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserManager;
