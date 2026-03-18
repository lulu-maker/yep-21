import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { getConversationMessages, getConversations, sendMessage } from '../../api/messagesApi';
import type { UserRole } from '../../types/auth';
import type { Conversation, Message } from '../../types/message';

interface AppMessagesPanelProps {
  userId: string;
  role: UserRole;
}

export function AppMessagesPanel({ userId, role }: AppMessagesPanelProps) {
  const [items, setItems] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const emptyLabel = useMemo(
    () => (role === 'client' ? 'No conversations with freelancers yet.' : 'No conversations with clients yet.'),
    [role],
  );

  const loadConversations = async () => {
    const response = await getConversations(userId);
    setItems(response.items);
    if (!activeId && response.items[0]) {
      setActiveId(response.items[0].id);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const response = await getConversationMessages(userId, conversationId);
    setMessages(response.items);
  };

  useEffect(() => {
    void loadConversations();
  }, [userId]);

  useEffect(() => {
    if (activeId) {
      void loadMessages(activeId);
    }
  }, [activeId, userId]);

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeId || isSending) return;

    setError(null);
    setIsSending(true);

    try {
      await sendMessage(userId, activeId, { content: text });
      setText('');
      await loadMessages(activeId);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container account-grid messaging-grid">
      <section className="info-card" aria-label="Conversation list">
        <h2>Conversations</h2>
        {items.length === 0 ? (
          <p>{emptyLabel}</p>
        ) : (
          items.map((item) => (
            <button
              type="button"
              className={`conversation-item ${item.id === activeId ? 'active' : ''}`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              aria-pressed={item.id === activeId}
            >
              <span>{item.lastMessagePreview}</span>
              <small>{new Date(item.lastMessageAt).toLocaleString()}</small>
            </button>
          ))
        )}
      </section>

      <section className="info-card" aria-label="Message thread">
        <h2>Messages</h2>
        {activeId ? (
          <>
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              <div className="thread-list">
                {messages.map((item) => (
                  <p key={item.id} className={`chat-bubble ${item.senderId === userId ? 'mine' : ''}`}>
                    {item.content}
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={onSend} className="message-compose">
              <label htmlFor="message-input">Type your message</label>
              <textarea
                id="message-input"
                rows={3}
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={5000}
              />
              <button className="btn btn-primary" type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </form>
            {error ? <p className="field-error">{error}</p> : null}
          </>
        ) : (
          <p>Select a conversation.</p>
        )}
      </section>
    </div>
  );
}
