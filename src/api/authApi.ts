import { normalizeEmail } from '../utils/validation';
import { readUsers, saveUsers } from './mockDb';
import type { AuthResponse, LoginRequest, RegisterRequest, SessionUser } from '../types/auth';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function token() {
  return Math.random().toString(36).slice(2);
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  await wait(500);
  const users = readUsers();
  const email = normalizeEmail(payload.email);

  if (users.some((user) => user.email === email)) {
    throw new Error('Email already registered.');
  }

  const user: SessionUser = {
    id: crypto.randomUUID(),
    fullName: payload.fullName,
    email,
    role: payload.role,
    onboardingCompleted: false,
  };

  users.push({ ...user, password: payload.password });
  saveUsers(users);

  return {
    user,
    accessToken: token(),
    refreshToken: token(),
  };
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  await wait(400);
  const email = normalizeEmail(payload.email);
  const users = readUsers();

  const found = users.find((item) => item.email === email && item.password === payload.password);

  if (!found) {
    throw new Error('Invalid email or password.');
  }

  const { password: _password, ...user } = found;

  return {
    user,
    accessToken: token(),
    refreshToken: token(),
  };
}

export async function forgotPassword(_payload: { email: string }): Promise<{ success: true }> {
  await wait(350);
  return { success: true };
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}): Promise<{ success: true }> {
  await wait(350);

  if (!payload.token) {
    throw new Error('Reset token is required.');
  }

  return { success: true };
}

export async function getCurrentUser(userId: string): Promise<SessionUser | null> {
  await wait(220);
  const users = readUsers();
  const found = users.find((user) => user.id === userId);

  if (!found) {
    return null;
  }

  const { password: _password, ...user } = found;
  return user;
}

export function patchUser(user: SessionUser) {
  const users = readUsers();
  const nextUsers = users.map((item) => (item.id === user.id ? { ...item, ...user } : item));
  saveUsers(nextUsers);
}
