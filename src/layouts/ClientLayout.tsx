import { RoleAccountLayout } from '../components/account/RoleAccountLayout';

export function ClientLayout() {
  return (
    <RoleAccountLayout
      label="Client Dashboard"
      basePath="/client"
      navItems={[
        { to: '/client/dashboard', label: 'Dashboard', end: true },
        { to: '/client/account', label: 'Profile Info' },
        { to: '/client/projects', label: 'My Projects' },
        { to: '/client/jobs', label: 'My Jobs' },
        { to: '/client/reports', label: 'Reports' },
        { to: '/client/wallet', label: 'Wallet' },
        { to: '/client/settings', label: 'Account Settings' },
        { to: '/client/support', label: 'Support' },
      ]}
    />
  );
}
