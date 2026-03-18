export interface FreelancerProfile {
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  country: string;
  avatarUrl: string;
  availability: 'open' | 'limited' | 'unavailable';
}
