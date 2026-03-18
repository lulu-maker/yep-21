import { RoleAccountLayout } from '../components/account/RoleAccountLayout';

export function FreelancerLayout() {
  return (
    <RoleAccountLayout
      label="Freelancer Dashboard"
      basePath="/freelancer"
      navItems={[
        { to: '/freelancer/dashboard', label: 'Dashboard', end: true },
        { to: '/freelancer/account', label: 'Profile Info' },
        { to: '/freelancer/contracts', label: 'My Projects' },
        { to: '/freelancer/jobs', label: 'My Jobs' },
        { to: '/freelancer/settings', label: 'Account Settings' },
        { to: '/freelancer/messages', label: 'Messages', badgeType: 'messages' },
        { to: '/freelancer/notifications', label: 'Notifications', badgeType: 'notifications' },
        { to: '/freelancer/support', label: 'Support' },
      ]}
    />
  );
}
