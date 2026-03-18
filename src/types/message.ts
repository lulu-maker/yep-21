export interface Conversation {
  id: string;
  clientId: string;
  freelancerId: string;
  jobId: string;
  proposalId?: string;
  contractId?: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadBy: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}
