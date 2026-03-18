import { useEffect, useMemo, useState } from 'react';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { DashboardShortcutCard } from '../../components/dashboard/DashboardShortcutCard';
import { getContracts } from '../../api/contractsApi';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { getFreelancerProposals } from '../../api/proposalsApi';
import { useAuth } from '../../contexts/AuthContext';

export function FreelancerDashboardPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({ jobs: 0, proposals: 0, contracts: 0, unreadMessages: 0, unreadNotifications: 0 });

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [jobs, proposals, contracts, conversations, notifications] = await Promise.all([
        getMarketplaceJobs({ page: 1, pageSize: 4 }),
        getFreelancerProposals(user.id),
        getContracts(user.id, 'freelancer'),
        getConversations(user.id),
        getNotifications(user.id),
      ]);
      setData({
        jobs: jobs.items.length,
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
      { to: '/freelancer/account', title: 'Profile Info', description: 'Update your freelancer profile details.', icon: '👤' },
      { to: '/freelancer/jobs', title: 'Find Jobs', description: `${data.jobs} recommended opportunities now.`, icon: '🔎' },
      { to: '/freelancer/proposals', title: 'My Proposals', description: `${data.proposals} proposals submitted.`, icon: '📝' },
      { to: '/freelancer/contracts', title: 'Contracts', description: `${data.contracts} active contracts in progress.`, icon: '📁' },
      { to: '/freelancer/messages', title: 'Messages', description: `${data.unreadMessages} unread conversations.`, icon: '💬' },
      { to: '/freelancer/settings', title: 'Settings / Support', description: `${data.unreadNotifications} unread notifications.`, icon: '⚙️' },
    ],
    [data],
  );

  if (isLoading) return <div className="container">Loading dashboard...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return (
    <div className="container dashboard-home">
      <DashboardHero name={user?.fullName ?? ''} />

      <section className="dashboard-intro">
        <div>
          <h2>Dashboard</h2>
          <p className="meta">Jump into your key freelancer workflows from one place.</p>
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
