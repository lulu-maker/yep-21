import { Link } from 'react-router-dom';
import type { Job } from '../../types/job';

interface JobCardProps {
  job: Job;
  view: 'client' | 'freelancer';
}

export function JobCard({ job, view }: JobCardProps) {
  const detailPath = view === 'client' ? `/client/jobs/${job.id}` : `/freelancer/jobs/${job.id}`;

  return (
    <article className="info-card">
      <p className="meta">{job.experienceLevel} · {job.status}</p>
      <h3>{job.title}</h3>
      <p>{job.description.slice(0, 140)}...</p>
      <p>
        Budget: ${job.budgetMin} - ${job.budgetMax}
      </p>
      <p>Skills: {job.skills.slice(0, 4).join(', ')}</p>
      <Link to={detailPath} className="btn btn-secondary">
        View details
      </Link>
    </article>
  );
}
