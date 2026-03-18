export type UserRole = 'client' | 'freelancer';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}
