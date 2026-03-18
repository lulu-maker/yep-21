import type { AppNotification, NotificationEvent } from '../types/notification';
import { readAppNotifications, saveAppNotifications } from './mockDb';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pushNotification(input: {
  userId: string;
  type: NotificationEvent;
  title: string;
  body: string;
  link: string;
}) {
  const notifications = readAppNotifications();
  notifications.unshift({
    id: crypto.randomUUID(),
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    link: input.link,
    createdAt: new Date().toISOString(),
    isRead: false,
  });
  saveAppNotifications(notifications);
}

export async function getNotifications(userId: string): Promise<{ items: AppNotification[]; unreadCount: number }> {
  await wait(220);
  const items = readAppNotifications().filter((item) => item.userId === userId);
  return { items, unreadCount: items.filter((item) => !item.isRead).length };
}

export async function markNotificationRead(userId: string, id: string): Promise<{ success: true }> {
  await wait(140);
  const next = readAppNotifications().map((item) =>
    item.id === id && item.userId === userId ? { ...item, isRead: true } : item,
  );
  saveAppNotifications(next);
  return { success: true };
}
