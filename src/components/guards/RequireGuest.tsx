import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireGuest() {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <p className="container section">Loading...</p>;
  }

  if (user) {
    if (user.role === 'client') {
      return <Navigate to={user.onboardingCompleted ? '/client/account' : '/client/onboarding'} replace />;
    }

    return <Navigate to={user.onboardingCompleted ? '/freelancer/account' : '/freelancer/onboarding'} replace />;
  }

  return <Outlet />;
}
