import { RoleAccountLayout } from '../components/account/RoleAccountLayout';

export function ClientLayout() {
  return (
    <RoleAccountLayout
      label="Client Dashboard"
      basePath="/client"
      navItems={[
        { to: '/client/dashboard', label: 'Dashboard' },
        { to: '/client/jobs', label: 'My Jobs' },
        { to: '/client/proposals', label: 'Proposals' },
        { to: '/client/contracts', label: 'Contracts' },
        { to: '/client/messages', label: 'Messages' },
        { to: '/client/notifications', label: 'Notifications' },
        { to: '/client/account', label: 'Account' },
        { to: '/client/settings', label: 'Settings' },
      ]}
    />
  );
}
