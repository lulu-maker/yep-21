import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { routeForAuthenticatedUser } from '../../utils/authRouting';

export function RequireGuest() {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <p className="container section">Loading...</p>;
  }

  if (user) {
    return <Navigate to={routeForAuthenticatedUser(user.role, user.onboardingCompleted)} replace />;
  }

  return <Outlet />;
}
