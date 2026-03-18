import type { FreelancerProfile } from '../types/freelancer';
import { readFreelancerProfile, saveFreelancerProfile } from './mockDb';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getFreelancerProfile(): Promise<FreelancerProfile> {
  await wait(280);
  return readFreelancerProfile();
}

export async function updateFreelancerProfile(payload: FreelancerProfile): Promise<{
  success: true;
  profile: FreelancerProfile;
}> {
  await wait(450);
  saveFreelancerProfile(payload);
  return { success: true, profile: payload };
}
