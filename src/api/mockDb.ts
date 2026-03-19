import type { SessionUser } from '../types/auth';
import type { ClientProfile, NotificationSettings } from '../types/client';
import type { Contract } from '../types/contract';
import type { FreelancerProfile } from '../types/freelancer';
import type { Job } from '../types/job';
import type { Conversation, Message } from '../types/message';
import type { AppNotification } from '../types/notification';
import type { Proposal } from '../types/proposal';
import type { Review } from '../types/review';
import type { VerificationRecord } from '../types/verification';

const USERS_KEY = 'yep21.users';
const CLIENT_PROFILE_KEY = 'yep21.client.profile';
const FREELANCER_PROFILE_KEY = 'yep21.freelancer.profile';
const NOTIFICATIONS_KEY = 'yep21.settings.notifications';
const JOBS_KEY = 'yep21.jobs';
const PROPOSALS_KEY = 'yep21.proposals';
const CONTRACTS_KEY = 'yep21.contracts';
const CONVERSATIONS_KEY = 'yep21.conversations';
const MESSAGES_KEY = 'yep21.messages';
const APP_NOTIFICATIONS_KEY = 'yep21.app.notifications';
const VERIFICATIONS_KEY = 'yep21.verifications';
const REVIEWS_KEY = 'yep21.reviews';

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
    phoneCode: '+1',
    phoneNumber: '',
    description: '',
    avatarUrl: '',
    activityStatus: 'active',
    verificationStatus: 'unverified',
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
    phoneCode: '+1',
    phoneNumber: '',
    avatarUrl: '',
    availability: 'open_for_work',
    activityStatus: 'active',
    verificationStatus: 'unverified',
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

export function readProposals() {
  return readJson<Proposal[]>(PROPOSALS_KEY, []);
}

export function saveProposals(proposals: Proposal[]) {
  writeJson(PROPOSALS_KEY, proposals);
}

export function readContracts() {
  return readJson<Contract[]>(CONTRACTS_KEY, []);
}

export function saveContracts(contracts: Contract[]) {
  writeJson(CONTRACTS_KEY, contracts);
}

export function readConversations() {
  return readJson<Conversation[]>(CONVERSATIONS_KEY, []);
}

export function saveConversations(conversations: Conversation[]) {
  writeJson(CONVERSATIONS_KEY, conversations);
}

export function readMessages() {
  return readJson<Message[]>(MESSAGES_KEY, []);
}

export function saveMessages(messages: Message[]) {
  writeJson(MESSAGES_KEY, messages);
}

export function readAppNotifications() {
  return readJson<AppNotification[]>(APP_NOTIFICATIONS_KEY, []);
}

export function saveAppNotifications(notifications: AppNotification[]) {
  writeJson(APP_NOTIFICATIONS_KEY, notifications);
}


export function readVerifications() {
  return readJson<VerificationRecord[]>(VERIFICATIONS_KEY, []);
}

export function saveVerifications(records: VerificationRecord[]) {
  writeJson(VERIFICATIONS_KEY, records);
}

export function readReviews() {
  return readJson<Review[]>(REVIEWS_KEY, []);
}

export function saveReviews(reviews: Review[]) {
  writeJson(REVIEWS_KEY, reviews);
}
