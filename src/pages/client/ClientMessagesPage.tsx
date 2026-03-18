import { FormEvent, useEffect, useState } from 'react';
import { getConversationMessages, getConversations, sendMessage } from '../../api/messagesApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Conversation, Message } from '../../types/message';

export function ClientMessagesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async () => {
    if (!user) return;
    const response = await getConversations(user.id);
    setItems(response.items);
    if (!activeId && response.items[0]) setActiveId(response.items[0].id);
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;
    const response = await getConversationMessages(user.id, conversationId);
    setMessages(response.items);
  };

  useEffect(() => { void loadConversations(); }, [user?.id]);
  useEffect(() => { if (activeId) void loadMessages(activeId); }, [activeId, user?.id]);

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !activeId) return;
    setError(null);
    try {
      await sendMessage(user.id, activeId, { content: text });
      setText('');
      await loadMessages(activeId);
      await loadConversations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message.');
    }
  };

  return (
    <div className="container account-grid messaging-grid">
      <section className="info-card"><h2>Conversations</h2>{items.length === 0 ? <p>No conversations yet.</p> : items.map((item) => <button className={`conversation-item ${item.id === activeId ? 'active' : ''}`} key={item.id} onClick={() => setActiveId(item.id)}>{item.lastMessagePreview}<small>{new Date(item.lastMessageAt).toLocaleString()}</small></button>)}</section>
      <section className="info-card"><h2>Messages</h2>{activeId ? <>{messages.length === 0 ? <p>No messages yet.</p> : <div className="thread-list">{messages.map((item) => <p key={item.id} className={`chat-bubble ${item.senderId === user?.id ? 'mine' : ''}`}>{item.content}</p>)}</div>}<form onSubmit={onSend} className="message-compose"><textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} maxLength={5000} /><button className="btn btn-primary" type="submit">Send</button></form>{error ? <p className="field-error">{error}</p> : null}</> : <p>Select a conversation.</p>}</section>
    </div>
  );
}
