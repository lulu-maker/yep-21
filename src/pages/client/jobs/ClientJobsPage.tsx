import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteJob, getClientJobs, updateJobStatus } from '../../../api/jobsApi';
import { useAuth } from '../../../contexts/AuthContext';
import type { Job, JobStatus } from '../../../types/job';

export function ClientJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const items = await getClientJobs(user.id);
      setJobs(items);
    } catch {
      setError('Unable to load jobs. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [user?.id]);

  const onStatusChange = async (jobId: string, status: JobStatus) => {
    if (!user) {
      return;
    }

    const requiresConfirm = status === 'closed';
    if (requiresConfirm && !window.confirm('Are you sure you want to close this job?')) {
      return;
    }

    await updateJobStatus(user.id, jobId, status);
    await load();
  };

  const onDelete = async (jobId: string) => {
    if (!user) {
      return;
    }

    if (!window.confirm('Delete this job permanently?')) {
      return;
    }

    await deleteJob(user.id, jobId);
    await load();
  };

  if (isLoading) {
    return <div className="container">Loading jobs...</div>;
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
      <div className="section-head">
        <h1>My Jobs</h1>
        <Link to="/client/jobs/new" className="btn btn-primary">
          Create Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="state-box">
          <p>You have not posted any jobs yet.</p>
          <Link to="/client/jobs/new" className="btn btn-primary">
            Create your first job
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {jobs.map((job) => (
            <article key={job.id} className="info-card">
              <p className="meta">Status: {job.status}</p>
              <h3>{job.title}</h3>
              <p>{job.description.slice(0, 140)}...</p>
              <p>
                Budget: ${job.budgetMin} - ${job.budgetMax}
              </p>
              <div className="job-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/client/jobs/${job.id}`)}>
                  View
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/client/jobs/${job.id}/edit`)}>
                  Edit
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void onStatusChange(job.id, 'paused')}>
                  Pause
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void onStatusChange(job.id, 'open')}>
                  Open
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void onStatusChange(job.id, 'closed')}>
                  Close
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void onDelete(job.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
