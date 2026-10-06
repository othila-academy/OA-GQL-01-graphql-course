import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LogIn } from 'lucide-react';
import Modal from './Modal';
import { LOGIN, LoginData } from '../queries';
import { useAuth } from '../auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password123');
  const [doLogin, { loading, error }] = useMutation<LoginData>(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await doLogin({ variables: { email, password } });
      if (data) {
        await login(data.login.token);
        onClose();
      }
    } catch {
      // l'erreur serveur est affichée via `error`
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connexion" size="small">
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Mot de passe</label>
          <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error">{error.message}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            <LogIn size={16} /> {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </div>
      </form>
      <p className="form-help">
        Comptes de test : alice@example.com (ADMIN), bob@example.com (TEACHER), charlie@example.com (STUDENT). Mot de passe : password123.
      </p>
    </Modal>
  );
};

export default LoginModal;
