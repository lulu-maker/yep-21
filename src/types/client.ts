export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type ActivityStatus = 'active' | 'inactive';

export interface ClientProfile {
  fullName: string;
  companyName: string;
  country: string;
  phoneCode?: string;
  phoneNumber?: string;
  description: string;
  avatarUrl: string;
  activityStatus: ActivityStatus;
  verificationStatus: VerificationStatus;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  jobAlerts: boolean;
}
