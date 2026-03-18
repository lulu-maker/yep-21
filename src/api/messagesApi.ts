import type { Conversation, Message } from '../types/message';
import { readContracts, readConversations, readMessages, readProposals, saveConversations, saveMessages } from './mockDb';
import { pushNotification } from './notificationsApi';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function canMessage(conversation: Conversation) {
  if (conversation.contractId) {
    return true;
  }
  return Boolean(conversation.proposalId);
}

export async function getConversations(userId: string): Promise<{ items: Conversation[] }> {
  await wait(200);
  const items = readConversations().filter((item) => item.clientId === userId || item.freelancerId === userId);
  return { items };
}

export async function getConversationMessages(userId: string, conversationId: string): Promise<{ items: Message[] }> {
  await wait(180);
  const conversation = readConversations().find((item) => item.id === conversationId);

  if (!conversation || (conversation.clientId !== userId && conversation.freelancerId !== userId)) {
    throw new Error('Conversation not found.');
  }

  const nextConversations = readConversations().map((item) =>
    item.id === conversationId ? { ...item, unreadBy: item.unreadBy.filter((id) => id !== userId) } : item,
  );
  saveConversations(nextConversations);

  return { items: readMessages().filter((item) => item.conversationId === conversationId) };
}

export async function sendMessage(
  userId: string,
  conversationId: string,
  payload: { content: string },
): Promise<{ id: string; content: string; createdAt: string }> {
  await wait(160);
  const content = payload.content.trim();

  if (!content) {
    throw new Error('Message content is required.');
  }

  if (content.length > 5000) {
    throw new Error('Message must be 5000 characters or fewer.');
  }

  const conversations = readConversations();
  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation || (conversation.clientId !== userId && conversation.freelancerId !== userId)) {
    throw new Error('Conversation not found.');
  }

  if (!canMessage(conversation)) {
    throw new Error('Messaging is only available after proposal or contract context exists.');
  }

  const receiverId = conversation.clientId === userId ? conversation.freelancerId : conversation.clientId;
  const createdAt = new Date().toISOString();
  const message: Message = {
    id: crypto.randomUUID(),
    conversationId,
    senderId: userId,
    receiverId,
    content,
    createdAt,
  };

  saveMessages([...readMessages(), message]);
  saveConversations(
    conversations.map((item) =>
      item.id === conversationId
        ? { ...item, lastMessageAt: createdAt, lastMessagePreview: content.slice(0, 120), unreadBy: [receiverId] }
        : item,
    ),
  );

  pushNotification({
    userId: receiverId,
    type: 'new_message',
    title: 'New message',
    body: content.slice(0, 90),
    link: '/client/messages',
  });

  return { id: message.id, content: message.content, createdAt };
}

export function ensureConversationByProposal(clientId: string, freelancerId: string, jobId: string, proposalId: string) {
  const conversations = readConversations();
  const existing = conversations.find((item) => item.proposalId === proposalId);
  if (existing) {
    return existing;
  }

  const hasProposal = readProposals().some((item) => item.id === proposalId && item.jobId === jobId);
  if (!hasProposal) {
    throw new Error('Cannot create conversation without a valid proposal.');
  }

  const conversation: Conversation = {
    id: crypto.randomUUID(),
    clientId,
    freelancerId,
    jobId,
    proposalId,
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: 'Conversation started.',
    unreadBy: [],
  };

  saveConversations([conversation, ...conversations]);
  return conversation;
}

export function ensureConversationByContract(contractId: string) {
  const conversations = readConversations();
  const existing = conversations.find((item) => item.contractId === contractId);
  if (existing) {
    return existing;
  }

  const contract = readContracts().find((item) => item.id === contractId);
  if (!contract) {
    throw new Error('Contract not found for conversation.');
  }

  const conversation: Conversation = {
    id: crypto.randomUUID(),
    clientId: contract.clientId,
    freelancerId: contract.freelancerId,
    jobId: contract.jobId,
    proposalId: contract.proposalId,
    contractId,
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: 'Contract conversation started.',
    unreadBy: [],
  };

  saveConversations([conversation, ...conversations]);
  return conversation;
}
