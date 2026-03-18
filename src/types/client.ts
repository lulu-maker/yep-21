export interface ClientProfile {
  fullName: string;
  companyName: string;
  country: string;
  description: string;
  avatarUrl: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  jobAlerts: boolean;
}
