import { AppNotificationsPanel } from '../../components/app/AppNotificationsPanel';
import { useAuth } from '../../contexts/AuthContext';

export function ClientNotificationsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <AppNotificationsPanel userId={user.id} />;
}
