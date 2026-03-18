import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markNotificationRead } from '../../api/notificationsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { AppNotification } from '../../types/notification';

export function ClientNotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);

  const load = async () => {
    if (!user) return;
    const response = await getNotifications(user.id);
    setItems(response.items);
  };

  useEffect(() => { void load(); }, [user?.id]);

  const open = async (item: AppNotification) => {
    if (!user || item.isRead) return;
    await markNotificationRead(user.id, item.id);
    await load();
  };

  return <div className="container account-grid"><h1>Notifications</h1>{items.length === 0 ? <div className="state-box"><p>No notifications yet.</p></div> : <div className="card-grid">{items.map((item) => <article className="info-card" key={item.id}><p className="meta">{new Date(item.createdAt).toLocaleString()}</p><h3>{item.title}</h3><p>{item.body}</p><Link to={item.link} className="btn btn-secondary" onClick={() => void open(item)}>{item.isRead ? 'Open' : 'Mark read & open'}</Link></article>)}</div>}</div>;
}
