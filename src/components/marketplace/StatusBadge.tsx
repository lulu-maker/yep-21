interface StatusBadgeProps {
  label: string;
  tone?: 'success' | 'warning' | 'muted';
}

export function StatusBadge({ label, tone = 'muted' }: StatusBadgeProps) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}
