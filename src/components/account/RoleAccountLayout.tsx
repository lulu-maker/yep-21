import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { useAuth } from '../../contexts/AuthContext';

interface RoleAccountLayoutProps {
  label: string;
  basePath: '/client' | '/freelancer';
  navItems: Array<{ to: string; label: string; badge?: number }>;
}

function Badge({ count }: { count?: number }) {
  if (!count) return null;
  return <span className="nav-badge">{count}</span>;
}

export function RoleAccountLayout({ label, basePath, navItems }: RoleAccountLayoutProps) {
  const { logout, user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [conversations, notifications] = await Promise.all([getConversations(user.id), getNotifications(user.id)]);
      setUnreadMessages(conversations.items.filter((item) => item.unreadBy.includes(user.id)).length);
      setUnreadNotifications(notifications.unreadCount);
    })();
  }, [user?.id]);

  const computedItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        badge:
          item.to.endsWith('/messages') ? unreadMessages : item.to.endsWith('/notifications') ? unreadNotifications : item.badge,
      })),
    [navItems, unreadMessages, unreadNotifications],
  );

  return (
    <div className="client-shell">
      <header className="site-header">
        <div className="container header-inner">
          <p className="brand">{label}</p>
          <nav className="nav-links app-nav-links" aria-label={`${label} navigation`}>
            {computedItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link">
                {item.label} <Badge count={item.badge} />
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="meta">{user?.email}</span>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="section">
        <Outlet />
      </main>
    </div>
  );
}
