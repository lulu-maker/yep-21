import { Link } from 'react-router-dom';

interface DashboardShortcutCardProps {
  to: string;
  title: string;
  description: string;
  icon: string;
}

export function DashboardShortcutCard({ to, title, description, icon }: DashboardShortcutCardProps) {
  return (
    <Link to={to} className="dashboard-shortcut-card">
      <div className="dashboard-shortcut-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}
