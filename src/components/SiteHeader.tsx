import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const publicNavItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

const authNavItems = [
  { to: '/jobs', label: 'Jobs' },
  { to: '/freelancers', label: 'Freelancers' },
  { to: '/support', label: 'Support' },
];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const accountPath = user?.role === 'client' ? '/client/account' : '/freelancer/account';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          yep-21
        </NavLink>

        <nav aria-label="Main navigation" className="nav-links">
          {(user ? authNavItems : publicNavItems).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <input type="search" placeholder="Search jobs & people" aria-label="Search jobs and people" />
              <Link to={accountPath} className="btn btn-secondary">
                Account
              </Link>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
