import type { ActivityStatus, VerificationStatus } from './client';

export type FreelancerAvailability = 'open_for_work' | 'partly_available' | 'unavailable' | 'open' | 'limited';

export interface FreelancerProfile {
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  country: string;
  phoneCode?: string;
  phoneNumber?: string;
  avatarUrl: string;
  availability: FreelancerAvailability;
  activityStatus: ActivityStatus;
  verificationStatus: VerificationStatus;
}
