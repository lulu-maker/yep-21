import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ClientLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="client-shell">
      <header className="site-header">
        <div className="container header-inner">
          <p className="brand">Client Area</p>
          <nav className="nav-links" aria-label="Client navigation">
            <NavLink to="/client/account" className="nav-link">
              Account
            </NavLink>
            <NavLink to="/client/settings" className="nav-link">
              Settings
            </NavLink>
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
