import { useEffect, useState } from 'react';
import { getNotificationSettings, updateNotificationSettings, updatePassword } from '../../api/settingsApi';
import type { NotificationSettings } from '../../types/client';

export function AccountSettingsShared() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    marketingEmails: false,
    jobAlerts: true,
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    void (async () => {
      const data = await getNotificationSettings();
      setSettings(data);
    })();
  }, []);

  const saveSettings = async () => {
    setError(null);
    setSuccess(null);
    setIsSavingSettings(true);

    try {
      await updateNotificationSettings(settings);
      setSuccess('Notification settings saved.');
    } catch {
      setError('Could not save notification settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const savePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!passwords.currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('Confirm new password must match.');
      return;
    }

    setIsSavingPassword(true);

    try {
      await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccess('Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch {
      setError('Unable to change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="container account-grid">
      <section className="info-card form-stack">
        <h2>Notifications</h2>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
          />
          Email notifications
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.marketingEmails}
            onChange={(e) => setSettings((prev) => ({ ...prev, marketingEmails: e.target.checked }))}
          />
          Marketing emails
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={settings.jobAlerts}
            onChange={(e) => setSettings((prev) => ({ ...prev, jobAlerts: e.target.checked }))}
          />
          Job alerts
        </label>
        <button type="button" className="btn btn-primary" onClick={() => void saveSettings()} disabled={isSavingSettings}>
          {isSavingSettings ? 'Saving...' : 'Save notification settings'}
        </button>
      </section>

      <section className="info-card form-stack">
        <h2>Security</h2>
        <label>
          Current password
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={passwords.confirmNewPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
          />
        </label>
        <button type="button" className="btn btn-primary" onClick={() => void savePassword()} disabled={isSavingPassword}>
          {isSavingPassword ? 'Updating...' : 'Update password'}
        </button>
      </section>

      {error ? <p className="field-error container">{error}</p> : null}
      {success ? <p className="field-success container">{success}</p> : null}
    </div>
  );
}
