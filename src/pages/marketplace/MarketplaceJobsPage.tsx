import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../types/job';

export function MarketplaceJobsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Job[]>([]);

  useEffect(() => {
    void (async () => {
      const response = await getMarketplaceJobs({ page: 1, pageSize: user ? 12 : 6 });
      setItems(response.items);
    })();
  }, [user?.id]);

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Marketplace Jobs</h1>
        {!user ? <Link className="btn btn-primary" to="/register">Sign up for full access</Link> : null}
      </div>
      <div className="card-grid">
        {items.map((job) => (
          <article key={job.id} className="info-card">
            <h3>{job.title}</h3>
            <p>{job.description.slice(0, 120)}...</p>
            <p className="meta">Budget ${job.budgetMin} - ${job.budgetMax}</p>
            <Link to={`/jobs/${job.id}`} className="btn btn-secondary">View details</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
