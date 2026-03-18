import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireGuest() {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <p className="container section">Loading...</p>;
  }

  if (user) {
    return <Navigate to={user.onboardingCompleted ? '/client/account' : '/client/onboarding'} replace />;
  }

  return <Outlet />;
}
