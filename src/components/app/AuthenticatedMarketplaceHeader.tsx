import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AuthenticatedMarketplaceHeader() {
  const { user, logout } = useAuth();
  const accountPath = user?.role === 'client' ? '/client/account' : '/freelancer/account';

  return (
    <div className="market-topbar">
      <NavLink to={user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'} className="brand">
        yep21
      </NavLink>

      <nav className="market-topbar-nav" aria-label="Marketplace navigation">
        <NavLink to="/jobs" className="nav-link">
          Jobs
        </NavLink>
        <NavLink to="/freelancers" className="nav-link">
          Freelancers
        </NavLink>
        <NavLink to="/support" className="nav-link">
          Support
        </NavLink>
      </nav>

      <label className="market-search" aria-label="Search jobs and people">
        <span className="sr-only">Search jobs & people</span>
        <input type="search" placeholder="Search jobs & people" />
      </label>

      <div className="market-account-actions">
        <NavLink to={accountPath} className="btn btn-secondary">
          Account
        </NavLink>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
