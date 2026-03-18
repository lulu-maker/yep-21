import { RoleAccountLayout } from '../components/account/RoleAccountLayout';

export function FreelancerLayout() {
  return (
    <RoleAccountLayout
      label="Freelancer Dashboard"
      basePath="/freelancer"
      navItems={[
        { to: '/freelancer/dashboard', label: 'Dashboard' },
        { to: '/freelancer/jobs', label: 'Find Jobs' },
        { to: '/freelancer/proposals', label: 'My Proposals' },
        { to: '/freelancer/contracts', label: 'Contracts' },
        { to: '/freelancer/messages', label: 'Messages' },
        { to: '/freelancer/notifications', label: 'Notifications' },
        { to: '/freelancer/account', label: 'Profile' },
        { to: '/freelancer/settings', label: 'Settings' },
      ]}
    />
  );
}
