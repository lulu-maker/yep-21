import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContract } from '../../api/contractsApi';
import { ensureConversationByProposal } from '../../api/messagesApi';
import { getClientProposals, updateProposalStatus } from '../../api/proposalsApi';
import { ProposalStatusBadge } from '../../components/jobs/ProposalStatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import type { Proposal } from '../../types/proposal';

export function ClientProposalsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      setItems(await getClientProposals(user.id));
    } catch {
      setError('Unable to load proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, [user?.id]);

  const onStatus = async (proposal: Proposal, status: 'shortlisted' | 'rejected' | 'accepted') => {
    if (!user) return;
    await updateProposalStatus(user.id, proposal.id, status);
    if (status === 'accepted') {
      const created = await createContract(user.id, {
        jobId: proposal.jobId,
        proposalId: proposal.id,
        freelancerId: proposal.freelancerId,
      });
      ensureConversationByProposal(user.id, proposal.freelancerId, proposal.jobId, proposal.id);
      navigate(`/client/contracts`);
      return;
    }
    await load();
  };

  if (isLoading) return <div className="container">Loading proposals...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return (
    <div className="container account-grid">
      <h1>Proposals</h1>
      {items.length === 0 ? <div className="state-box"><p>No proposals received yet.</p></div> : (
      <div className="card-grid">{items.map((item) => <article className="info-card" key={item.id}><p className="meta">Freelancer #{item.freelancerId.slice(0,8)}</p><p>{item.coverLetter.slice(0, 140)}</p><p>Bid ${item.bidAmount} · {item.deliveryDays} days</p><ProposalStatusBadge status={item.status} />{item.status === 'pending' ? <div className="job-actions"><button className="btn btn-secondary" onClick={() => void onStatus(item, 'shortlisted')}>Shortlist</button><button className="btn btn-ghost" onClick={() => void onStatus(item, 'rejected')}>Reject</button><button className="btn btn-primary" onClick={() => void onStatus(item, 'accepted')}>Accept & Hire</button></div> : null}</article>)}</div>) }
    </div>
  );
}
