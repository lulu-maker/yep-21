import type { Contract, ContractStatus, CreateContractPayload } from '../types/contract';
import { readContracts, readJobs, readProposals, saveContracts, saveProposals } from './mockDb';
import { pushNotification } from './notificationsApi';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createContract(clientId: string, payload: CreateContractPayload): Promise<{ id: string; status: 'active' }> {
  await wait(260);
  const job = readJobs().find((item) => item.id === payload.jobId);
  if (!job) {
    throw new Error('Job not found.');
  }
  if (job.clientId !== clientId) {
    throw new Error('Forbidden: you do not own this job.');
  }

  const proposals = readProposals();
  const proposal = proposals.find((item) => item.id === payload.proposalId && item.jobId === payload.jobId);
  if (!proposal || proposal.freelancerId !== payload.freelancerId) {
    throw new Error('Invalid proposal for this contract.');
  }

  const existing = readContracts().find((item) => item.proposalId === proposal.id);
  if (existing) {
    throw new Error('Contract already exists for this proposal.');
  }

  const contract: Contract = {
    id: crypto.randomUUID(),
    jobId: payload.jobId,
    proposalId: payload.proposalId,
    freelancerId: payload.freelancerId,
    clientId,
    bidAmount: proposal.bidAmount,
    deliveryDays: proposal.deliveryDays,
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  saveContracts([contract, ...readContracts()]);
  saveProposals(proposals.map((item) => (item.id === proposal.id ? { ...item, status: 'accepted' } : item)));

  pushNotification({
    userId: payload.freelancerId,
    type: 'contract_created',
    title: 'You were hired',
    body: `A contract was created for ${job.title}.`,
    link: '/freelancer/contracts',
  });

  return { id: contract.id, status: 'active' };
}

export async function getContracts(userId: string, role: 'client' | 'freelancer'): Promise<{ items: Contract[] }> {
  await wait(200);
  const items = readContracts().filter((item) => (role === 'client' ? item.clientId === userId : item.freelancerId === userId));
  return { items };
}

export async function patchContractStatus(
  userId: string,
  role: 'client' | 'freelancer',
  contractId: string,
  status: Extract<ContractStatus, 'completed' | 'cancelled'>,
): Promise<{ success: true }> {
  await wait(180);
  const contracts = readContracts();
  const contract = contracts.find((item) => item.id === contractId);

  if (!contract) {
    throw new Error('Contract not found.');
  }

  if (role === 'client' && contract.clientId !== userId) {
    throw new Error('Forbidden: contract is not owned by this client.');
  }

  if (role === 'freelancer' && contract.freelancerId !== userId) {
    throw new Error('Forbidden: contract is not owned by this freelancer.');
  }

  const updated = contracts.map((item) => (item.id === contractId ? { ...item, status } : item));
  saveContracts(updated);

  pushNotification({
    userId: role === 'client' ? contract.freelancerId : contract.clientId,
    type: status === 'completed' ? 'contract_completed' : 'contract_cancelled',
    title: `Contract ${status}`,
    body: `Contract #${contract.id.slice(0, 8)} was marked ${status}.`,
    link: role === 'client' ? '/freelancer/contracts' : '/client/contracts',
  });

  return { success: true };
}
