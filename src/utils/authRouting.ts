import type { UserRole } from '../types/auth';

export function roleBasePath(role: UserRole) {
  return role === 'freelancer' ? '/freelancer' : '/client';
}

export function roleOnboardingPath(role: UserRole) {
  return `${roleBasePath(role)}/onboarding`;
}

export function roleAccountPath(role: UserRole) {
  return `${roleBasePath(role)}/account`;
}

export function routeForAuthenticatedUser(role: UserRole, onboardingCompleted: boolean) {
  return onboardingCompleted ? roleAccountPath(role) : roleOnboardingPath(role);
}
