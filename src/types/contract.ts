export interface Contract {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: string;
  status: 'active';
}
