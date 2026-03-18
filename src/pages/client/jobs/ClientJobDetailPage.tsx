import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteJob, getJobById, updateJobStatus } from '../../../api/jobsApi';
import { useAuth } from '../../../contexts/AuthContext';
import type { Job } from '../../../types/job';

export function ClientJobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const item = await getJobById(user.id, id);
      setJob(item);
    } catch {
      setError('Unable to fetch this job.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id, user?.id]);

  const onStatus = async (status: Job['status']) => {
    if (!user || !job) {
      return;
    }

    if (status === 'closed' && !window.confirm('Close this job?')) {
      return;
    }

    await updateJobStatus(user.id, job.id, status);
    await load();
  };

  const onDelete = async () => {
    if (!user || !job) {
      return;
    }

    if (!window.confirm('Delete this job? This action cannot be undone.')) {
      return;
    }

    await deleteJob(user.id, job.id);
    navigate('/client/jobs');
  };

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

  return (
    <div className="container account-grid">
      <div className="section-head">
        <h1>{job.title}</h1>
        <div className="job-actions">
          <Link to={`/client/jobs/${job.id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button type="button" className="btn btn-ghost" onClick={() => void onStatus('paused')}>
            Pause
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void onStatus('open')}>
            Open
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void onStatus('closed')}>
            Close
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => void onDelete()}>
            Delete
          </button>
        </div>
      </div>

      <article className="info-card">
        <p className="meta">Status: {job.status}</p>
        <p>{job.description}</p>
        <p>
          Budget: ${job.budgetMin} - ${job.budgetMax}
        </p>
        <p>Experience: {job.experienceLevel}</p>
        <p>Skills: {job.skills.join(', ')}</p>
      </article>
    </div>
  );
}
