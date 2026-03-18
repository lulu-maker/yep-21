import type { SessionUser } from '../types/auth';
import type { ClientProfile, NotificationSettings } from '../types/client';

const USERS_KEY = 'yep21.users';
const PROFILE_KEY = 'yep21.client.profile';
const NOTIFICATIONS_KEY = 'yep21.client.notifications';

export interface StoredUser extends SessionUser {
  password: string;
}

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readUsers() {
  return readJson<StoredUser[]>(USERS_KEY, []);
}

export function saveUsers(users: StoredUser[]) {
  writeJson(USERS_KEY, users);
}

export function readClientProfile() {
  return readJson<ClientProfile>(PROFILE_KEY, {
    fullName: '',
    companyName: '',
    country: '',
    description: '',
    avatarUrl: '',
  });
}

export function saveClientProfile(profile: ClientProfile) {
  writeJson(PROFILE_KEY, profile);
}

export function readNotificationSettings() {
  return readJson<NotificationSettings>(NOTIFICATIONS_KEY, {
    emailNotifications: true,
    marketingEmails: false,
    jobAlerts: true,
  });
}

export function saveNotificationSettings(settings: NotificationSettings) {
  writeJson(NOTIFICATIONS_KEY, settings);
}
