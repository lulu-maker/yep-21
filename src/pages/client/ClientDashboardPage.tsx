import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardHero } from '../../components/dashboard/DashboardHero';
import { DashboardShortcutCard } from '../../components/dashboard/DashboardShortcutCard';
import { getContracts } from '../../api/contractsApi';
import { getClientJobs } from '../../api/jobsApi';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { getClientProposals } from '../../api/proposalsApi';
import { useAuth } from '../../contexts/AuthContext';
import { getSavedItems } from '../../api/savedItemsApi';
import { MOCK_FREELANCERS } from '../../data/mockFreelancers';

export function ClientDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, proposals: 0, contracts: 0, unreadMessages: 0, unreadNotifications: 0 });
  const [savedJobs, setSavedJobs] = useState<{ id: string; title: string }[]>([]);
  const [savedFreelancers, setSavedFreelancers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [jobs, proposals, contracts, conversations, notifications, saved] = await Promise.all([
        getClientJobs(user.id),
        getClientProposals(user.id),
        getContracts(user.id, 'client'),
        getConversations(user.id),
        getNotifications(user.id),
        getSavedItems(user.id),
      ]);
      setStats({
        jobs: jobs.length,
        proposals: proposals.length,
        contracts: contracts.items.filter((item) => item.status === 'active').length,
        unreadMessages: conversations.items.filter((item) => item.unreadBy.includes(user.id)).length,
        unreadNotifications: notifications.unreadCount,
      });
      setSavedJobs(jobs.filter((item) => saved.jobs.includes(item.id)).map((item) => ({ id: item.id, title: item.title })));
      setSavedFreelancers(
        MOCK_FREELANCERS.filter((item) => saved.freelancers.includes(item.id)).map((item) => ({ id: item.id, name: item.name })),
      );
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
      { to: '/client/projects', title: 'My Projects', description: `${stats.contracts} active project contracts.`, icon: '📄' },
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

      <section className="dashboard-saved-grid">
        <article className="info-card">
          <h3>Saved jobs</h3>
          {savedJobs.length ? (
            <ul className="saved-list">
              {savedJobs.slice(0, 5).map((item) => (
                <li key={item.id}><Link to={`/jobs/${item.id}`}>{item.title}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="meta">No saved jobs yet.</p>
          )}
        </article>
        <article className="info-card">
          <h3>Saved freelancers</h3>
          {savedFreelancers.length ? (
            <ul className="saved-list">
              {savedFreelancers.slice(0, 5).map((item) => (
                <li key={item.id}><Link to={`/freelancers/${item.id}`}>{item.name}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="meta">No saved freelancers yet.</p>
          )}
        </article>
      </section>
    </div>
  );
}
