import type { ProposalStatus } from '../../types/proposal';

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
}

export function ProposalStatusBadge({ status }: ProposalStatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}
