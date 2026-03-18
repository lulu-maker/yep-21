import type { ClientProfile } from '../types/client';
import { readClientProfile, saveClientProfile } from './mockDb';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function updateClientProfile(payload: ClientProfile): Promise<{
  success: true;
  profile: ClientProfile;
}> {
  await wait(450);
  saveClientProfile(payload);
  return { success: true, profile: payload };
}

export async function getClientProfile() {
  await wait(280);
  return readClientProfile();
}
