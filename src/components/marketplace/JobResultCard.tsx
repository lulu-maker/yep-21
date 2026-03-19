import { useNavigate } from 'react-router-dom';
import type { VerificationStatus } from '../../types/client';
import { CompanyAvatar } from './CompanyAvatar';
import { MetadataRow } from './MetadataRow';
import { SaveButton } from './SaveButton';
import { StatusBadge } from './StatusBadge';
import { TagChipList } from './TagChipList';
import { VerificationBadge } from './VerificationBadge';

export interface JobResultItem {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyVerificationStatus: VerificationStatus;
  title: string;
  summary: string;
  tags: string[];
  location: string;
  workplaceType: string;
  contractType: string;
  duration: string;
  budgetMin: number;
  budgetMax: number;
  rateType: string;
  startTiming: string;
  postedAt: string;
  createdAt: string;
  isSaved: boolean;
  status: 'open' | 'paused' | string;
}

export function JobResultCard({
  item,
  onToggleSave,
}: {
  item: JobResultItem;
  onToggleSave: (id: string) => void;
}) {
  const navigate = useNavigate();

  return (
    <article
      className="job-result-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/jobs/${item.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/jobs/${item.id}`);
        }
      }}
    >
      <div className="result-top-row">
        <div className="result-company">
          <CompanyAvatar name={item.companyName} logoUrl={item.companyLogo} />
          <div>
            <p className="meta">{item.companyName}</p>
            <VerificationBadge status={item.companyVerificationStatus} />
          </div>
        </div>
        <SaveButton isSaved={item.isSaved} onToggle={() => onToggleSave(item.id)} />
      </div>

      <h3 className="result-title">{item.title}</h3>
      <p className="result-summary">{item.summary}</p>

      <TagChipList tags={item.tags} />

      <MetadataRow
        items={[
          { label: 'Location', value: item.location },
          { label: 'Workplace', value: item.workplaceType },
          { label: 'Contract', value: item.contractType },
          { label: 'Duration', value: item.duration },
          { label: 'Budget', value: `$${item.budgetMin} - $${item.budgetMax} (${item.rateType})` },
          { label: 'Start', value: item.startTiming },
        ]}
      />

      <div className="result-footer-row">
        <small className="meta">Posted {item.postedAt}</small>
        <div className="result-footer-actions">
          <StatusBadge label={item.status === 'open' ? 'Open' : 'Paused'} tone={item.status === 'open' ? 'success' : 'muted'} />
          <span className="text-link">View details</span>
        </div>
      </div>
    </article>
  );
}
