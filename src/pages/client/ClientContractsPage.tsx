import { useEffect, useState } from 'react';
import { getContracts, patchContractStatus } from '../../api/contractsApi';
import { useAuth } from '../../contexts/AuthContext';
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

  if (isLoading) return <div className="container">Loading contracts...</div>;
  if (error) return <div className="container state-box"><p>{error}</p><button className="btn btn-secondary" onClick={() => void load()}>Retry</button></div>;

  return <div className="container account-grid"><h1>Contracts</h1>{items.length === 0 ? <div className="state-box"><p>No contracts yet.</p></div> : <div className="card-grid">{items.map((item) => <article className="info-card" key={item.id}><p className="meta">#{item.id.slice(0,8)} · {item.status}</p><p>Job: {item.jobId.slice(0,8)}</p><p>Amount: ${item.bidAmount}</p>{item.status === 'active' ? <div className="job-actions"><button className="btn btn-secondary" onClick={() => void onStatus(item.id, 'completed')}>Mark completed</button><button className="btn btn-ghost" onClick={() => void onStatus(item.id, 'cancelled')}>Cancel</button></div> : null}</article>)}</div>}</div>;
}
