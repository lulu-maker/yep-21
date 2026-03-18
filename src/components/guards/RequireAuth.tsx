import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireAuth() {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <p className="container section">Loading account...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
