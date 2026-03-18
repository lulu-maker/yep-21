import { readContracts, readReviews, saveReviews } from './mockDb';
import type { Review, ReviewRole } from '../types/review';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEntityReviews(entityType: 'freelancer' | 'client', id: string): Promise<{
  averageRating: number;
  reviewCount: number;
  items: Review[];
}> {
  await wait(170);
  const items = readReviews().filter((item) => item.revieweeId === id);
  const reviewCount = items.length;
  const averageRating = reviewCount ? Number((items.reduce((sum, item) => sum + item.rating, 0) / reviewCount).toFixed(1)) : 0;
  return { averageRating, reviewCount, items };
}

export async function getReviewEligibility(contractId: string, userId: string): Promise<{ eligible: boolean; reason?: string }> {
  await wait(120);
  const contract = readContracts().find((item) => item.id === contractId);
  if (!contract) {
    return { eligible: false, reason: 'Contract not found.' };
  }
  if (contract.status !== 'completed') {
    return { eligible: false, reason: 'Contract must be completed before reviewing.' };
  }
  if (contract.clientId !== userId && contract.freelancerId !== userId) {
    return { eligible: false, reason: 'Only contract participants can leave reviews.' };
  }

  const exists = readReviews().some((item) => item.contractId === contractId && item.reviewerId === userId);
  if (exists) {
    return { eligible: false, reason: 'You already submitted a review for this contract.' };
  }

  return { eligible: true };
}

export async function createReview(payload: {
  reviewerId: string;
  revieweeId: string;
  contractId: string;
  role: ReviewRole;
  rating: number;
  comment: string;
}): Promise<Review> {
  await wait(220);

  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    throw new Error('Rating must be an integer from 1 to 5.');
  }

  if (payload.comment.length > 2000) {
    throw new Error('Comment cannot exceed 2000 characters.');
  }

  const eligibility = await getReviewEligibility(payload.contractId, payload.reviewerId);
  if (!eligibility.eligible) {
    throw new Error(eligibility.reason ?? 'Review not allowed.');
  }

  const review: Review = {
    id: crypto.randomUUID(),
    reviewerId: payload.reviewerId,
    revieweeId: payload.revieweeId,
    contractId: payload.contractId,
    role: payload.role,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  };

  saveReviews([review, ...readReviews()]);
  return review;
}
