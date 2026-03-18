import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function FreelancerLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="client-shell">
      <header className="site-header">
        <div className="container header-inner">
          <p className="brand">Freelancer Area</p>
          <nav className="nav-links" aria-label="Freelancer navigation">
            <NavLink to="/freelancer/account" className="nav-link">
              Account
            </NavLink>
            <NavLink to="/freelancer/settings" className="nav-link">
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
