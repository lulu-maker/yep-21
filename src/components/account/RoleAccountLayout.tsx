import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleAccountLayoutProps {
  label: string;
  basePath: '/client' | '/freelancer';
  includeJobs?: boolean;
}

export function RoleAccountLayout({ label, basePath, includeJobs = false }: RoleAccountLayoutProps) {
  const { logout, user } = useAuth();

  return (
    <div className="client-shell">
      <header className="site-header">
        <div className="container header-inner">
          <p className="brand">{label}</p>
          <nav className="nav-links" aria-label={`${label} navigation`}>
            <NavLink to={`${basePath}/account`} className="nav-link">
              Account
            </NavLink>
            {includeJobs ? (
              <NavLink to={`${basePath}/jobs`} className="nav-link">
                Jobs
              </NavLink>
            ) : null}
            <NavLink to={`${basePath}/settings`} className="nav-link">
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
