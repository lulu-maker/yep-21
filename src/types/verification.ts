import type { VerificationStatus } from './client';

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
}

export interface VerificationRecord {
  userId: string;
  verificationStatus: VerificationStatus;
  submittedAt: string | null;
  documents: VerificationDocument[];
}
