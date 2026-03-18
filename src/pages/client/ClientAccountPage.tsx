import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientProfile } from '../../api/clientApi';
import { useAuth } from '../../contexts/AuthContext';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import type { ClientProfile } from '../../types/client';

export function ClientAccountPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getClientProfile();
      setProfile(data);
    })();
  }, []);

  if (!profile) {
    return <div className="container">Loading profile info...</div>;
  }

  const skills = profile.description
    .split(/[,.]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="container profile-page">
      <div className="profile-page-head">
        <h2>Profile Info</h2>
        <Link to="/client/account/edit" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>

      <section className="profile-hero info-card">
        <div className="profile-cover" />
        <div className="profile-summary">
          <div className="profile-avatar">{(profile.fullName || user?.fullName || 'C').slice(0, 1).toUpperCase()}</div>
          <div>
            <h3>{profile.fullName || user?.fullName || 'Client user'}</h3>
            <p className="meta">{profile.companyName || 'Company not added'} · {profile.country || 'Country not set'}</p>
            <div className="chip-row">
              <span className={`status-pill ${profile.activityStatus === 'active' ? 'success' : 'muted'}`}>{profile.activityStatus === 'active' ? 'Active' : 'Inactive'}</span>
              <VerificationBadge status={profile.verificationStatus} />
            </div>
          </div>
        </div>
      </section>

      <section className="info-card">
        <h3>Language</h3>
        <p>English (Professional)</p>
      </section>

      <section className="info-card">
        <h3>About</h3>
        <p>{profile.description || 'No description provided yet.'}</p>
      </section>

      <section className="info-card">
        <h3>Experience</h3>
        <p>Client project owner and hiring manager.</p>
      </section>

      <section className="info-card">
        <h3>Attachments</h3>
        <p>No attachments uploaded yet.</p>
      </section>

      <section className="info-card">
        <h3>Skills</h3>
        <div className="chip-row">
          {(skills.length ? skills : ['Project Planning', 'Hiring', 'Communication']).map((skill) => (
            <span key={skill} className="chip">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
