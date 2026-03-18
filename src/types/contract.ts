export type ContractStatus = 'active' | 'completed' | 'cancelled';

export interface Contract {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: string;
  status: ContractStatus;
}

export interface CreateContractPayload {
  jobId: string;
  proposalId: string;
  freelancerId: string;
}
