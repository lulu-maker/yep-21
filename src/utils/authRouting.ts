import type { UserRole } from '../types/auth';

export function roleBasePath(role: UserRole) {
  return role === 'freelancer' ? '/freelancer' : '/client';
}

export function roleOnboardingPath(role: UserRole) {
  return `${roleBasePath(role)}/onboarding`;
}

export function roleDashboardPath(role: UserRole) {
  return `${roleBasePath(role)}/dashboard`;
}

export function routeForAuthenticatedUser(role: UserRole, onboardingCompleted: boolean) {
  return onboardingCompleted ? roleDashboardPath(role) : roleOnboardingPath(role);
}
