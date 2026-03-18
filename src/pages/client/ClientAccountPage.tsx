import { useEffect, useMemo, useState } from 'react';
import { getClientProfile, updateClientProfile } from '../../api/clientApi';
import { useAuth } from '../../contexts/AuthContext';
import type { ClientProfile } from '../../types/client';

function calcCompletion(profile: ClientProfile) {
  const checks = [profile.fullName.trim(), profile.country.trim(), profile.description.trim()];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function ClientAccountPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ClientProfile>({
    fullName: user?.fullName ?? '',
    companyName: '',
    country: '',
    description: '',
    avatarUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getClientProfile();
      setProfile((prev) => ({ ...prev, ...data, fullName: prev.fullName || data.fullName }));
      setIsLoading(false);
    })();
  }, []);

  const completion = useMemo(() => calcCompletion(profile), [profile]);

  const save = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await updateClientProfile(profile);
      if (user) {
        updateUser({ ...user, fullName: profile.fullName.trim() });
      }
      setMessage('Profile saved successfully.');
    } catch {
      setMessage('Unable to save. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container">Loading account...</div>;
  }

  return (
    <div className="container account-grid">
      <section className="card-grid">
        <article className="info-card">
          <h2>Personal details</h2>
          <p>{profile.fullName || '—'}</p>
          <p>{user?.email || '—'}</p>
        </article>
        <article className="info-card">
          <h2>Company profile</h2>
          <p>{profile.companyName || 'No company added yet'}</p>
          <p>{profile.country || 'Country not set'}</p>
        </article>
        <article className="info-card">
          <h2>Profile completion</h2>
          <p>{completion}% complete</p>
        </article>
        <article className="info-card">
          <h2>Posted jobs</h2>
          <p>0 active jobs (placeholder)</p>
        </article>
      </section>

      <section className="info-card form-stack">
        <h2>Edit profile</h2>
        <label>
          Full name
          <input
            value={profile.fullName}
            onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
          />
        </label>
        <label>
          Company name
          <input
            value={profile.companyName}
            onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))}
          />
        </label>
        <label>
          Country
          <input
            value={profile.country}
            onChange={(e) => setProfile((prev) => ({ ...prev, country: e.target.value }))}
          />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={profile.description}
            onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))}
          />
        </label>
        <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save profile'}
        </button>
        {message ? <p className="field-success">{message}</p> : null}
      </section>
    </div>
  );
}
