import { RoleAccountLayout } from '../components/account/RoleAccountLayout';

export function FreelancerLayout() {
  return (
    <RoleAccountLayout
      label="Freelancer Dashboard"
      basePath="/freelancer"
      navItems={[
        { to: '/freelancer/dashboard', label: 'Dashboard', end: true },
        { to: '/freelancer/account', label: 'Profile Info' },
        { to: '/freelancer/jobs', label: 'Find Jobs' },
        { to: '/freelancer/proposals', label: 'My Proposals' },
        { to: '/freelancer/contracts', label: 'Contracts' },
        { to: '/freelancer/messages', label: 'Messages', badgeType: 'messages' },
        { to: '/freelancer/notifications', label: 'Notifications', badgeType: 'notifications' },
        { to: '/freelancer/settings', label: 'Settings' },
        { to: '/freelancer/support', label: 'Support' },
      ]}
    />
  );
}
