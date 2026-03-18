import { useEffect, useMemo, useState } from 'react';
import { getContracts } from '../../api/contractsApi';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { getConversations } from '../../api/messagesApi';
import { getNotifications } from '../../api/notificationsApi';
import { getFreelancerProfile } from '../../api/freelancerApi';
import { getFreelancerProposals } from '../../api/proposalsApi';
import { useAuth } from '../../contexts/AuthContext';

export function FreelancerDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({ jobs: 0, proposals: 0, contracts: 0, unreadMessages: 0, unreadNotifications: 0, completion: 0 });

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [jobs, proposals, contracts, conversations, notifications, profile] = await Promise.all([
        getMarketplaceJobs({ page: 1, pageSize: 4 }),
        getFreelancerProposals(user.id),
        getContracts(user.id, 'freelancer'),
        getConversations(user.id),
        getNotifications(user.id),
        getFreelancerProfile(),
      ]);
      const checks = [profile.fullName, profile.title, profile.bio, profile.skills.length ? '1' : '', profile.country].filter(Boolean).length;
      setData({
        jobs: jobs.items.length,
        proposals: proposals.length,
        contracts: contracts.items.filter((item) => item.status === 'active').length,
        unreadMessages: conversations.items.filter((item) => item.unreadBy.includes(user.id)).length,
        unreadNotifications: notifications.unreadCount,
        completion: Math.round((checks / 5) * 100),
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

  const profileLabel = useMemo(() => (data.completion < 70 ? 'Needs work' : 'Looking great'), [data.completion]);

  if (isLoading) return <div className="container">Loading dashboard...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return (
    <div className="container account-grid">
      <h1>Freelancer Dashboard</h1>
      <section className="card-grid stats-grid">
        <article className="info-card"><h3>Recommended Jobs</h3><p>{data.jobs}</p></article>
        <article className="info-card"><h3>My Proposals</h3><p>{data.proposals}</p></article>
        <article className="info-card"><h3>Active Contracts</h3><p>{data.contracts}</p></article>
        <article className="info-card"><h3>Profile Completion</h3><p>{data.completion}% · {profileLabel}</p></article>
        <article className="info-card"><h3>Unread Messages</h3><p>{data.unreadMessages}</p></article>
        <article className="info-card"><h3>Notifications</h3><p>{data.unreadNotifications}</p></article>
      </section>
    </div>
  );
}
