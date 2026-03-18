import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMarketplaceJobById } from '../../api/jobsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../types/job';

export function MarketplaceJobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    void (async () => {
      const item = await getMarketplaceJobById(id);
      setJob(item);
    })();
  }, [id]);

  if (!job) return <div className="container section">Loading job...</div>;

  if (!user) {
    return (
      <div className="container section">
        <h1>{job.title}</h1>
        <p>{job.description.slice(0, 220)}...</p>
        <div className="state-box">
          <p>Create an account to view full details and apply.</p>
          <div className="job-actions">
            <Link className="btn btn-primary" to="/register">Register</Link>
            <Link className="btn btn-secondary" to="/login">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p>Budget ${job.budgetMin} - ${job.budgetMax}</p>
      <p>Skills: {job.skills.join(', ')}</p>
    </div>
  );
}
