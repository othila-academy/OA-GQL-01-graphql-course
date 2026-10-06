import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UserMinus, UserPlus } from 'lucide-react';
import { EventSummary, JOIN_EVENT, LEAVE_EVENT } from '../queries';
import { useAuth } from '../auth';

const RegisterButton: React.FC<{ event: EventSummary }> = ({ event }) => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [join, { loading: joining }] = useMutation(JOIN_EVENT, { refetchQueries: 'active' });
  const [leave, { loading: leaving }] = useMutation(LEAVE_EVENT, { refetchQueries: 'active' });

  if (!user) {
    return (
      <button className="btn-primary" disabled title="Connectez-vous pour vous inscrire">
        <UserPlus size={16} /> S'inscrire
      </button>
    );
  }

  const registered = event.participants.some((p) => p.id === user.id);

  const toggle = async () => {
    setError(null);
    try {
      if (registered) await leave({ variables: { eventId: event.id } });
      else await join({ variables: { eventId: event.id } });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <button className={registered ? 'btn-danger' : 'btn-primary'} onClick={toggle} disabled={joining || leaving}>
        {registered ? <><UserMinus size={16} /> Se désinscrire</> : <><UserPlus size={16} /> S'inscrire</>}
      </button>
      {error && <span className="error">{error}</span>}
    </>
  );
};

export default RegisterButton;
