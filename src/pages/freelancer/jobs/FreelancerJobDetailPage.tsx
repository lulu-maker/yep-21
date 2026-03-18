import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMarketplaceJobById } from '../../../api/jobsApi';
import type { Job } from '../../../types/job';

export function FreelancerJobDetailPage() {
  const { id = '' } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const item = await getMarketplaceJobById(id);
      setJob(item);
    } catch {
      setError('Unable to load job details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  if (isLoading) {
    return <div className="container">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="container state-box">
        <p>{error ?? 'Job not found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    );
  }

  const isApplyDisabled = job.status !== 'open';
  const applyLabel = job.status === 'paused' ? 'Job paused' : job.status === 'closed' ? 'Job closed' : 'Apply now';

  return (
    <div className="container account-grid">
      <Link to="/freelancer/jobs" className="text-link">
        ← Back to jobs
      </Link>
      <article className="info-card">
        <p className="meta">{job.experienceLevel} · {job.status}</p>
        <h1>{job.title}</h1>
        {job.category ? <p className="meta">Category: {job.category}</p> : null}
        <p>{job.description}</p>
        <p>
          Budget: ${job.budgetMin} - ${job.budgetMax}
        </p>
        <p>Skills: {job.skills.join(', ')}</p>
        <button type="button" className="btn btn-primary" disabled={isApplyDisabled}>
          {applyLabel}
        </button>
        {job.status === 'paused' ? <p className="field-error">This job is temporarily unavailable.</p> : null}
      </article>
    </div>
  );
}
