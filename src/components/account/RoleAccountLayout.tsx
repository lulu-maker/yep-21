import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { useAuth } from '../../contexts/AuthContext';
import { AuthenticatedMarketplaceHeader } from '../app/AuthenticatedMarketplaceHeader';

interface NavItem {
  to: string;
  label: string;
  badgeType?: 'messages' | 'notifications';
  end?: boolean;
}

interface RoleAccountLayoutProps {
  label: string;
  basePath: '/client' | '/freelancer';
  navItems: NavItem[];
}

function Badge({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="nav-badge" aria-label={`${count} unread`}>
      {count}
    </span>
  );
}

export function RoleAccountLayout({ label, basePath, navItems }: RoleAccountLayoutProps) {
  const { logout, user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          item.badgeType === 'messages'
            ? unreadMessages
            : item.badgeType === 'notifications'
              ? unreadNotifications
              : undefined,
      })),
    [navItems, unreadMessages, unreadNotifications],
  );

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`} aria-label={`${label} sidebar navigation`}>
        <div className="app-sidebar-top">
          <NavLink to={`${basePath}/dashboard`} className="brand" onClick={() => setIsSidebarOpen(false)}>
            yep21
          </NavLink>
          <p className="meta">{label}</p>
        </div>

        <nav className="app-sidebar-nav">
          {computedItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span>{item.label}</span>
              <Badge count={item.badge} />
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <p className="meta truncate">{user?.email}</p>
          <button type="button" className="btn btn-ghost sidebar-logout" onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="app-content-wrap">
        <header className="app-content-header">
          <button type="button" className="btn btn-ghost sidebar-toggle" onClick={() => setIsSidebarOpen((prev) => !prev)}>
            {isSidebarOpen ? 'Close menu' : 'Menu'}
          </button>
          <AuthenticatedMarketplaceHeader />
        </header>

        <main className="app-content-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
