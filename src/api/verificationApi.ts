import { readVerifications, saveVerifications } from './mockDb';
import type { VerificationRecord } from '../types/verification';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultRecord(userId: string): VerificationRecord {
  return {
    userId,
    verificationStatus: 'unverified',
    submittedAt: null,
    documents: [],
  };
}

export async function getVerificationStatus(userId: string): Promise<VerificationRecord> {
  await wait(140);
  const existing = readVerifications().find((item) => item.userId === userId);
  return existing ?? defaultRecord(userId);
}

export async function getVerificationDocuments(userId: string): Promise<{ documents: VerificationRecord['documents'] }> {
  await wait(120);
  const status = await getVerificationStatus(userId);
  return { documents: status.documents };
}

export async function submitVerification(
  userId: string,
  documents: Array<{ name: string; type: string }>,
): Promise<{ verificationStatus: 'pending'; submittedAt: string }> {
  await wait(220);

  if (!documents.length) {
    throw new Error('Please upload at least one verification document.');
  }

  const withIds = documents.map((doc) => ({ ...doc, id: crypto.randomUUID() }));
  const records = readVerifications();
  const submittedAt = new Date().toISOString();
  const next: VerificationRecord = {
    userId,
    verificationStatus: 'pending',
    submittedAt,
    documents: withIds,
  };

  const updated = records.some((item) => item.userId === userId)
    ? records.map((item) => (item.userId === userId ? next : item))
    : [next, ...records];

  saveVerifications(updated);
  return { verificationStatus: 'pending', submittedAt };
}
