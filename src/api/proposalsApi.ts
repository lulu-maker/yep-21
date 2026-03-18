import type { Proposal, ProposalPayload, ProposalStatus } from '../types/proposal';
import { readJobs, readProposals, saveProposals } from './mockDb';
import { pushNotification } from './notificationsApi';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validatePayload(payload: ProposalPayload) {
  if (payload.coverLetter.trim().length < 30) {
    throw new Error('Cover letter must be at least 30 characters.');
  }

  if (payload.bidAmount <= 0) {
    throw new Error('Bid amount must be positive.');
  }

  if (payload.deliveryDays < 1) {
    throw new Error('Delivery days must be at least 1.');
  }
}

export async function createProposal(jobId: string, freelancerId: string, payload: ProposalPayload): Promise<Proposal> {
  await wait(400);
  validatePayload(payload);

  const jobs = readJobs();
  const job = jobs.find((item) => item.id === jobId);

  if (!job) {
    throw new Error('Job not found.');
  }

  if (job.clientId === freelancerId) {
    throw new Error('You cannot apply to your own job.');
  }

  if (job.status === 'paused' || job.status === 'closed') {
    throw new Error('This job is not accepting proposals right now.');
  }

  const proposals = readProposals();
  const exists = proposals.find((item) => item.jobId === jobId && item.freelancerId === freelancerId);

  if (exists) {
    throw new Error('You already submitted a proposal for this job.');
  }

  const proposal: Proposal = {
    id: crypto.randomUUID(),
    jobId,
    freelancerId,
    coverLetter: payload.coverLetter.trim(),
    bidAmount: payload.bidAmount,
    deliveryDays: payload.deliveryDays,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  proposals.unshift(proposal);
  saveProposals(proposals);

  pushNotification({
    userId: job.clientId,
    type: 'proposal_received',
    title: 'New proposal received',
    body: `A freelancer submitted a proposal for ${job.title}.`,
    link: `/client/jobs/${job.id}/proposals`,
  });

  return proposal;
}

export async function getFreelancerProposals(freelancerId: string): Promise<Proposal[]> {
  await wait(260);
  return readProposals().filter((item) => item.freelancerId === freelancerId);
}

export async function getFreelancerProposalByJob(jobId: string, freelancerId: string): Promise<Proposal | null> {
  await wait(180);
  return readProposals().find((item) => item.jobId === jobId && item.freelancerId === freelancerId) ?? null;
}

export async function getClientProposals(clientId: string): Promise<Proposal[]> {
  await wait(200);
  const ownedJobIds = new Set(readJobs().filter((item) => item.clientId === clientId).map((item) => item.id));
  return readProposals().filter((item) => ownedJobIds.has(item.jobId));
}

export async function getJobProposals(clientId: string, jobId: string): Promise<Proposal[]> {
  await wait(200);
  const job = readJobs().find((item) => item.id === jobId);
  if (!job) {
    throw new Error('Job not found.');
  }
  if (job.clientId !== clientId) {
    throw new Error('Forbidden: you do not own this job.');
  }

  return readProposals().filter((item) => item.jobId === jobId);
}

export async function updateProposalStatus(
  clientId: string,
  proposalId: string,
  status: Exclude<ProposalStatus, 'pending'>,
): Promise<{ success: true }> {
  await wait(220);
  const proposals = readProposals();
  const proposal = proposals.find((item) => item.id === proposalId);

  if (!proposal) {
    throw new Error('Proposal not found.');
  }

  const job = readJobs().find((item) => item.id === proposal.jobId);
  if (!job || job.clientId !== clientId) {
    throw new Error('Forbidden: proposal is not for your job.');
  }

  const next = proposals.map((item) => (item.id === proposalId ? { ...item, status } : item));
  saveProposals(next);

  pushNotification({
    userId: proposal.freelancerId,
    type: status === 'accepted' ? 'proposal_accepted' : 'proposal_rejected',
    title: `Proposal ${status}`,
    body: `Your proposal for ${job.title} was ${status}.`,
    link: '/freelancer/proposals',
  });

  return { success: true };
}
