import { useEffect, useState } from 'react';
import { getContracts } from '../../api/contractsApi';
import { useAuth } from '../../contexts/AuthContext';
import { createReview, getReviewEligibility } from '../../api/reviewsApi';
import type { Contract } from '../../types/contract';

export function FreelancerContractsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getContracts(user.id, 'freelancer');
      setItems(response.items);
    } catch {
      setError('Unable to load contracts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [user?.id]);


  const onReview = async (contractId: string, revieweeId: string) => {
    if (!user) return;
    const eligibility = await getReviewEligibility(contractId, user.id);
    if (!eligibility.eligible) {
      window.alert(eligibility.reason);
      return;
    }
    const rating = Number(window.prompt('Rate client from 1 to 5', '5'));
    const comment = window.prompt('Add a short comment (optional)', '') ?? '';
    await createReview({
      reviewerId: user.id,
      revieweeId,
      contractId,
      role: 'freelancer_to_client',
      rating,
      comment,
    });
    window.alert('Review submitted.');
  };

  if (isLoading) return <div className="container">Loading contracts...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button type="button" className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return (
    <div className="container account-grid">
      <h1>My Contracts</h1>
      {items.length === 0 ? (
        <div className="state-box">
          <p>No active contracts yet.</p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <article className="info-card" key={item.id}>
              <p className="meta">
                #{item.id.slice(0, 8)} · {item.status}
              </p>
              <p>Budget: ${item.bidAmount}</p>
              <p>Delivery: {item.deliveryDays} days</p>
              {item.status === 'completed' ? <button className="btn btn-secondary" onClick={() => void onReview(item.id, item.clientId)}>Leave review</button> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
