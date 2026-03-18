import { useEffect, useState } from 'react';
import { getContracts } from '../../api/contractsApi';
import { getClientJobs } from '../../api/jobsApi';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { getClientProposals } from '../../api/proposalsApi';
import { useAuth } from '../../contexts/AuthContext';

export function ClientDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, proposals: 0, contracts: 0, unreadMessages: 0, unreadNotifications: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [jobs, proposals, contracts, conversations, notifications] = await Promise.all([
        getClientJobs(user.id),
        getClientProposals(user.id),
        getContracts(user.id, 'client'),
        getConversations(user.id),
        getNotifications(user.id),
      ]);
      setStats({
        jobs: jobs.length,
        proposals: proposals.length,
        contracts: contracts.items.filter((item) => item.status === 'active').length,
        unreadMessages: conversations.items.filter((item) => item.unreadBy.includes(user.id)).length,
        unreadNotifications: notifications.unreadCount,
      });
    } catch {
      setError('Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [user?.id]);

  if (isLoading) return <div className="container">Loading dashboard...</div>;
  if (error) {
    return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;
  }

  return (
    <div className="container account-grid">
      <h1>Client Dashboard</h1>
      <section className="card-grid stats-grid">
        <article className="info-card"><h3>Active Jobs</h3><p>{stats.jobs}</p></article>
        <article className="info-card"><h3>Proposals Received</h3><p>{stats.proposals}</p></article>
        <article className="info-card"><h3>Active Contracts</h3><p>{stats.contracts}</p></article>
        <article className="info-card"><h3>Unread Messages</h3><p>{stats.unreadMessages}</p></article>
        <article className="info-card"><h3>Notifications</h3><p>{stats.unreadNotifications}</p></article>
      </section>
    </div>
  );
}
