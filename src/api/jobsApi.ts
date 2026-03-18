import type { Job, JobPayload, JobStatus } from '../types/job';
import { readJobs, saveJobs } from './mockDb';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requireOwnedJob(jobId: string, clientId: string) {
  const jobs = readJobs();
  const job = jobs.find((item) => item.id === jobId);

  if (!job) {
    throw new Error('Job not found.');
  }

  if (job.clientId !== clientId) {
    throw new Error('Forbidden: you do not own this job.');
  }

  return { job, jobs };
}

export async function createJob(clientId: string, payload: JobPayload): Promise<Job> {
  await wait(400);
  const now = new Date().toISOString();
  const job: Job = {
    id: crypto.randomUUID(),
    clientId,
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  const jobs = readJobs();
  jobs.unshift(job);
  saveJobs(jobs);
  return job;
}

export async function updateJob(clientId: string, jobId: string, payload: JobPayload): Promise<Job> {
  await wait(360);
  const { jobs } = requireOwnedJob(jobId, clientId);

  const updated = jobs.map((item) =>
    item.id === jobId
      ? {
          ...item,
          ...payload,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

  saveJobs(updated);
  return updated.find((item) => item.id === jobId)!;
}

export async function getClientJobs(clientId: string): Promise<Job[]> {
  await wait(320);
  return readJobs().filter((job) => job.clientId === clientId);
}

export async function getJobById(clientId: string, jobId: string): Promise<Job> {
  await wait(220);
  const { job } = requireOwnedJob(jobId, clientId);
  return job;
}

export async function deleteJob(clientId: string, jobId: string): Promise<{ success: true }> {
  await wait(260);
  const { jobs } = requireOwnedJob(jobId, clientId);
  saveJobs(jobs.filter((item) => item.id !== jobId));
  return { success: true };
}

export async function updateJobStatus(
  clientId: string,
  jobId: string,
  status: JobStatus,
): Promise<{ success: true; job: Job }> {
  await wait(260);
  const { jobs } = requireOwnedJob(jobId, clientId);
  const updated = jobs.map((item) =>
    item.id === jobId ? { ...item, status, updatedAt: new Date().toISOString() } : item,
  );
  saveJobs(updated);
  return { success: true, job: updated.find((item) => item.id === jobId)! };
}

export interface JobsQuery {
  search?: string;
  category?: string;
  experienceLevel?: Job['experienceLevel'] | '';
  budgetMin?: number;
  budgetMax?: number;
  page?: number;
  pageSize?: number;
}

export async function getMarketplaceJobs(query: JobsQuery): Promise<{
  items: Job[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await wait(320);

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 6;

  const filtered = readJobs()
    .filter((job) => job.status === 'open')
    .filter((job) =>
      query.search
        ? `${job.title} ${job.description}`.toLowerCase().includes(query.search.toLowerCase().trim())
        : true,
    )
    .filter((job) => (query.category ? (job.category ?? '').toLowerCase() === query.category.toLowerCase() : true))
    .filter((job) => (query.experienceLevel ? job.experienceLevel === query.experienceLevel : true))
    .filter((job) => (query.budgetMin ? job.budgetMax >= query.budgetMin : true))
    .filter((job) => (query.budgetMax ? job.budgetMin <= query.budgetMax : true));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
  };
}

export async function getMarketplaceJobById(jobId: string): Promise<Job> {
  await wait(220);
  const job = readJobs().find((item) => item.id === jobId);

  if (!job) {
    throw new Error('Job not found.');
  }

  return job;
}
