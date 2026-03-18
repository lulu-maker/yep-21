export type ProposalStatus = 'pending' | 'shortlisted' | 'rejected' | 'accepted';

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  status: ProposalStatus;
  createdAt: string;
}

export interface ProposalPayload {
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
}
