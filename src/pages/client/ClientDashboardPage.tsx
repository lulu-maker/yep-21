import { useEffect, useMemo, useState } from 'react';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { DashboardShortcutCard } from '../../components/dashboard/DashboardShortcutCard';
import { getContracts } from '../../api/contractsApi';
import { getClientJobs } from '../../api/jobsApi';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { getClientProposals } from '../../api/proposalsApi';
import { useAuth } from '../../contexts/AuthContext';

export function ClientDashboardPage() {
  const { user, logout } = useAuth();
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

  const cards = useMemo(
    () => [
      { to: '/client/account', title: 'Profile Info', description: 'Manage your profile and company details.', icon: '👤' },
      { to: '/client/jobs', title: 'My Jobs', description: `${stats.jobs} jobs currently listed.`, icon: '📄' },
      { to: '/client/reports', title: 'Reports', description: `${stats.proposals} proposals tracked.`, icon: '📊' },
      { to: '/client/wallet', title: 'Wallet', description: `${stats.contracts} active contract payments.`, icon: '💼' },
      { to: '/client/settings', title: 'Account Settings', description: `${stats.unreadNotifications} notifications need review.`, icon: '⚙️' },
      { to: '/client/support', title: 'Support', description: `${stats.unreadMessages} unread message threads.`, icon: '🛟' },
    ],
    [stats],
  );

  if (isLoading) return <div className="container">Loading dashboard...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return (
    <div className="container dashboard-home">
      <DashboardHero name={user?.fullName ?? ''} />

      <section className="dashboard-intro">
        <div>
          <h2>Dashboard</h2>
          <p className="meta">Quickly access your account tools and workspace shortcuts.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logout}>Log Out</button>
      </section>

      <section className="dashboard-shortcut-grid">
        {cards.map((card) => (
          <DashboardShortcutCard key={card.to} {...card} />
        ))}
      </section>
    </div>
  );
}
