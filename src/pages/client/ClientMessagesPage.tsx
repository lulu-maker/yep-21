import { AppMessagesPanel } from '../../components/app/AppMessagesPanel';
import { useAuth } from '../../contexts/AuthContext';

export function ClientMessagesPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <AppMessagesPanel userId={user.id} role="client" />;
}
