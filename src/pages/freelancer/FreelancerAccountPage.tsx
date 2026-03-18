import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFreelancerProfile } from '../../api/freelancerApi';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import type { FreelancerProfile } from '../../types/freelancer';

export function FreelancerAccountPage() {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getFreelancerProfile();
      setProfile(data);
    })();
  }, []);

  if (!profile) {
    return <div className="container">Loading profile info...</div>;
  }

  return (
    <div className="container profile-page">
      <div className="profile-page-head">
        <h2>Profile Info</h2>
        <Link to="/freelancer/account/edit" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>

      <section className="profile-hero info-card">
        <div className="profile-cover" />
        <div className="profile-summary">
          <div className="profile-avatar">{(profile.fullName || 'F').slice(0, 1).toUpperCase()}</div>
          <div>
            <h3>{profile.fullName || 'Freelancer'}</h3>
            <p className="meta">{profile.title || 'Title missing'} · {profile.country || 'Country missing'}</p>
            <div className="chip-row">
              <span className={`status-pill ${profile.availability === 'open_for_work' || profile.availability === 'open' ? 'success' : profile.availability === 'partly_available' || profile.availability === 'limited' ? 'warning' : 'muted'}`}>
                {profile.availability === 'open_for_work' || profile.availability === 'open' ? 'Open for work' : profile.availability === 'partly_available' || profile.availability === 'limited' ? 'Partly available' : 'Unavailable'}
              </span>
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
        <p>{profile.bio || 'No bio added yet.'}</p>
      </section>

      <section className="info-card">
        <h3>Experience</h3>
        <p>{profile.availability === 'open' ? 'Open for new work' : 'Currently occupied'}</p>
      </section>

      <section className="info-card">
        <h3>Attachments</h3>
        <p>No portfolio attachments uploaded yet.</p>
      </section>

      <section className="info-card">
        <h3>Skills</h3>
        <div className="chip-row">
          {(profile.skills.length ? profile.skills : ['React', 'TypeScript', 'UI Design']).map((skill) => (
            <span key={skill} className="chip">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
