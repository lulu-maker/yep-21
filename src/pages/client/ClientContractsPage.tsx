import { useEffect, useState } from 'react';
import { getContracts, patchContractStatus } from '../../api/contractsApi';
import { useAuth } from '../../contexts/AuthContext';
import { createReview, getReviewEligibility } from '../../api/reviewsApi';
import type { Contract } from '../../types/contract';

export function ClientContractsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getContracts(user.id, 'client');
      setItems(response.items);
    } catch {
      setError('Unable to load contracts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, [user?.id]);

  const onStatus = async (contractId: string, status: 'completed' | 'cancelled') => {
    if (!user) return;
    await patchContractStatus(user.id, 'client', contractId, status);
    await load();
  };


  const onReview = async (contractId: string, revieweeId: string) => {
    if (!user) return;
    const eligibility = await getReviewEligibility(contractId, user.id);
    if (!eligibility.eligible) {
      window.alert(eligibility.reason);
      return;
    }

    const rating = Number(window.prompt('Rate this collaboration from 1 to 5', '5'));
    const comment = window.prompt('Add a short comment (optional)', '') ?? '';
    await createReview({
      reviewerId: user.id,
      revieweeId,
      contractId,
      role: 'client_to_freelancer',
      rating,
      comment,
    });
    window.alert('Review submitted.');
  };

  if (isLoading) return <div className="container">Loading contracts...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return <div className="container account-grid"><h1>Contracts</h1>{items.length === 0 ? <div className="state-box"><p>No contracts yet.</p></div> : <div className="card-grid">{items.map((item) => <article className="info-card" key={item.id}><p className="meta">#{item.id.slice(0,8)} · {item.status}</p><p>Job: {item.jobId.slice(0,8)}</p><p>Amount: ${item.bidAmount}</p>{item.status === 'active' ? <div className="job-actions"><button className="btn btn-secondary" onClick={() => void onStatus(item.id, 'completed')}>Mark completed</button><button className="btn btn-ghost" onClick={() => void onStatus(item.id, 'cancelled')}>Cancel</button></div> : null}{item.status === 'completed' ? <button className="btn btn-secondary" onClick={() => void onReview(item.id, item.freelancerId)}>Leave review</button> : null}</article>)}</div>}</div>;
}
