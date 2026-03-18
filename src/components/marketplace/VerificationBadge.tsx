import type { VerificationStatus } from '../../types/client';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

const LABELS: Record<VerificationStatus, string> = {
  unverified: 'Unverified',
  pending: 'Verification Pending',
  verified: 'Verified',
  rejected: 'Verification Rejected',
};

const TONES: Record<VerificationStatus, 'success' | 'warning' | 'muted'> = {
  verified: 'success',
  pending: 'warning',
  unverified: 'muted',
  rejected: 'muted',
};

export function VerificationBadge({ status }: VerificationBadgeProps) {
  return <span className={`status-pill ${TONES[status]}`}>{LABELS[status]}</span>;
}
