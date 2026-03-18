import type { NotificationSettings } from '../types/client';
import { readNotificationSettings, saveNotificationSettings } from './mockDb';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function updateNotificationSettings(payload: NotificationSettings): Promise<{ success: true }> {
  await wait(320);
  saveNotificationSettings(payload);
  return { success: true };
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  await wait(220);
  return readNotificationSettings();
}

export async function updatePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: true }> {
  await wait(320);

  if (!payload.currentPassword || !payload.newPassword) {
    throw new Error('Current and new password are required.');
  }

  return { success: true };
}
