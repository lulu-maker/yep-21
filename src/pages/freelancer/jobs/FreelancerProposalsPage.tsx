import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMarketplaceJobById } from '../../../api/jobsApi';
import { getFreelancerProposals } from '../../../api/proposalsApi';
import { ProposalStatusBadge } from '../../../components/jobs/ProposalStatusBadge';
import { useAuth } from '../../../contexts/AuthContext';
import type { Proposal } from '../../../types/proposal';

interface ProposalWithJob extends Proposal {
  jobTitle: string;
}

export function FreelancerProposalsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ProposalWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const proposals = await getFreelancerProposals(user.id);
      const merged = await Promise.all(
        proposals.map(async (proposal) => {
          try {
            const job = await getMarketplaceJobById(proposal.jobId);
            return { ...proposal, jobTitle: job.title };
          } catch {
            return { ...proposal, jobTitle: 'Job unavailable' };
          }
        }),
      );
      setItems(merged);
    } catch {
      setError('Unable to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [user?.id]);

  if (isLoading) {
    return <div className="container">Loading proposals...</div>;
  }

  if (error) {
    return (
      <div className="container state-box">
        <p>{error}</p>
        <button type="button" className="btn btn-secondary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container account-grid">
      <h1>My Proposals</h1>

      {items.length === 0 ? (
        <div className="state-box">
          <p>You have not submitted any proposals yet.</p>
          <Link to="/freelancer/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((proposal) => (
            <article key={proposal.id} className="info-card">
              <p className="meta">Submitted on {new Date(proposal.createdAt).toLocaleDateString()}</p>
              <h3>{proposal.jobTitle}</h3>
              <p>Bid: ${proposal.bidAmount}</p>
              <p>Delivery: {proposal.deliveryDays} days</p>
              <ProposalStatusBadge status={proposal.status} />
              <Link to={`/freelancer/jobs/${proposal.jobId}`} className="btn btn-secondary">
                Open Job
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
