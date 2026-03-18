export type ReviewRole = 'client_to_freelancer' | 'freelancer_to_client';

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  contractId: string;
  role: ReviewRole;
  rating: number;
  comment: string;
  createdAt: string;
}
