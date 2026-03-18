export type NotificationEvent =
  | 'proposal_received'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'new_message'
  | 'contract_created'
  | 'contract_completed'
  | 'contract_cancelled';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationEvent;
  title: string;
  body: string;
  link: string;
  createdAt: string;
  isRead: boolean;
}
