import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClientProfile, updateClientProfile } from '../../api/clientApi';
import { useAuth } from '../../contexts/AuthContext';
import type { ClientProfile } from '../../types/client';
import { VerificationPanel } from '../../components/trust/VerificationPanel';

export function ClientProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ClientProfile>({
    fullName: user?.fullName ?? '',
    companyName: '',
    country: '',
    description: '',
    avatarUrl: '',
    activityStatus: 'active',
    verificationStatus: 'unverified',
  });
  const [skills, setSkills] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getClientProfile();
      setProfile(data);
      setSkills(data.description);
    })();
  }, []);

  const save = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateClientProfile({ ...profile, description: skills });
      if (user) {
        updateUser({ ...user, fullName: profile.fullName.trim() });
      }
      setMessage('Changes saved.');
      navigate('/client/account');
    } catch {
      setMessage('Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container form-page">
      <div className="profile-page-head">
        <h2>Edit Profile Info</h2>
        <div className="job-actions">
          <Link to="/client/account" className="btn btn-ghost">Cancel</Link>
          <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>

      <section className="info-card form-stack">
        <div className="two-col-grid">
          <label>First name<input value={profile.fullName.split(' ')[0] ?? ''} onChange={(e) => setProfile((prev) => ({ ...prev, fullName: `${e.target.value} ${prev.fullName.split(' ').slice(1).join(' ')}`.trim() }))} /></label>
          <label>Last name<input value={profile.fullName.split(' ').slice(1).join(' ')} onChange={(e) => setProfile((prev) => ({ ...prev, fullName: `${prev.fullName.split(' ')[0] ?? ''} ${e.target.value}`.trim() }))} /></label>
        </div>
        <div className="two-col-grid">
          <label>Country<input value={profile.country} onChange={(e) => setProfile((prev) => ({ ...prev, country: e.target.value }))} /></label>
          <label>Email<input value={user?.email ?? ''} disabled /></label>
        </div>
        <label>Job category<input value={profile.companyName} onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))} /></label>
        <label>Languages<input defaultValue="English" /></label>
        <label>About<textarea rows={4} value={skills} onChange={(e) => setSkills(e.target.value)} /></label>
        <label>Experience<textarea rows={3} placeholder="Add your experience" /></label>
        <label>Attachments<div className="upload-box">Drop files or click to upload</div></label>
        <label>Skills<input placeholder="Add comma-separated skills" /></label>
        <div className="two-col-grid">
          <label>Activity status<select value={profile.activityStatus} onChange={(e) => setProfile((prev) => ({ ...prev, activityStatus: e.target.value as 'active' | 'inactive' }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
          <label>Verification status<select value={profile.verificationStatus} onChange={(e) => setProfile((prev) => ({ ...prev, verificationStatus: e.target.value as 'unverified' | 'pending' | 'verified' | 'rejected' }))}><option value="unverified">Unverified</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select></label>
        </div>

        {message ? <p className="field-success">{message}</p> : null}
      </section>

      {user ? <VerificationPanel userId={user.id} /> : null}
    </div>
  );
}
