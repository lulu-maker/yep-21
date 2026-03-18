import { Link } from 'react-router-dom';
import type { Job } from '../../types/job';
import { StatusBadge } from './StatusBadge';

export function MarketplaceResultCard({ item }: { item: Job & { companyName: string; workplaceType: string; contractType: string; duration: string; startTiming: string; isSaved?: boolean; postedLabel: string; locationLabel: string; } }) {
  return (
    <article className="market-card dense">
      <div className="market-card-head">
        <div className="market-avatar">{item.companyName.slice(0, 1)}</div>
        <div>
          <p className="meta">{item.companyName}</p>
          <h3>{item.title}</h3>
        </div>
        <button type="button" className="btn btn-ghost">{item.isSaved ? 'Saved' : 'Save'}</button>
      </div>

      <p>{item.description.slice(0, 180)}...</p>

      <div className="chip-row">
        {item.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="chip">{skill}</span>
        ))}
        {item.skills.length > 4 ? <span className="chip">+{item.skills.length - 4}</span> : null}
      </div>

      <div className="result-meta-grid">
        <span>{item.locationLabel}</span>
        <span>{item.workplaceType}</span>
        <span>{item.contractType}</span>
        <span>{item.duration}</span>
        <span>{item.startTiming}</span>
        <StatusBadge label={item.status === 'open' ? 'Open' : 'Paused'} tone={item.status === 'open' ? 'success' : 'muted'} />
      </div>

      <div className="result-card-footer">
        <small className="meta">Posted {item.postedLabel}</small>
        <Link to={`/jobs/${item.id}`} className="btn btn-secondary">Open project</Link>
      </div>
    </article>
  );
}
