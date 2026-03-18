export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';

export type ExperienceLevel = 'entry' | 'intermediate' | 'expert';

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  category?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JobPayload {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  category?: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  status: JobStatus;
}
