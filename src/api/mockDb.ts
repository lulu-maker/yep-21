import type { SessionUser } from '../types/auth';
import type { ClientProfile, NotificationSettings } from '../types/client';
import type { FreelancerProfile } from '../types/freelancer';
import type { Job } from '../types/job';

const USERS_KEY = 'yep21.users';
const CLIENT_PROFILE_KEY = 'yep21.client.profile';
const FREELANCER_PROFILE_KEY = 'yep21.freelancer.profile';
const NOTIFICATIONS_KEY = 'yep21.settings.notifications';
const JOBS_KEY = 'yep21.jobs';

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
  return readJson<ClientProfile>(CLIENT_PROFILE_KEY, {
    fullName: '',
    companyName: '',
    country: '',
    description: '',
    avatarUrl: '',
  });
}

export function saveClientProfile(profile: ClientProfile) {
  writeJson(CLIENT_PROFILE_KEY, profile);
}

export function readFreelancerProfile() {
  return readJson<FreelancerProfile>(FREELANCER_PROFILE_KEY, {
    fullName: '',
    title: '',
    bio: '',
    skills: [],
    hourlyRate: 0,
    country: '',
    avatarUrl: '',
    availability: 'open',
  });
}

export function saveFreelancerProfile(profile: FreelancerProfile) {
  writeJson(FREELANCER_PROFILE_KEY, profile);
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


export function readJobs() {
  return readJson<Job[]>(JOBS_KEY, []);
}

export function saveJobs(jobs: Job[]) {
  writeJson(JOBS_KEY, jobs);
}
