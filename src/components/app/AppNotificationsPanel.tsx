import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead } from '../../api/notificationsApi';
import type { AppNotification } from '../../types/notification';

interface AppNotificationsPanelProps {
  userId: string;
}

export function AppNotificationsPanel({ userId }: AppNotificationsPanelProps) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getNotifications(userId);
      setItems(response.items);
    } catch {
      setError('Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [userId]);

  const onOpen = async (item: AppNotification) => {
    if (!item.isRead) {
      await markNotificationRead(userId, item.id);
    }
    await load();
  };

  if (isLoading) {
    return <div className="container">Loading notifications...</div>;
  }

  if (error) {
    return (
      <div className="container state-box">
        <p>{error}</p>
        <button type="button" className="btn btn-secondary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container account-grid">
      <h1>Notifications</h1>
      {items.length === 0 ? (
        <div className="state-box">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <article className={`info-card ${item.isRead ? '' : 'info-card-unread'}`} key={item.id}>
              <p className="meta">{new Date(item.createdAt).toLocaleString()}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link to={item.link} className="btn btn-secondary" onClick={() => void onOpen(item)}>
                {item.isRead ? 'Open' : 'Mark read & open'}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
