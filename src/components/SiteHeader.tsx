import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="brand">
          yep-21
        </NavLink>

        <nav aria-label="Main navigation" className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
