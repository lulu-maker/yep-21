import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '../../components/marketplace/StatusBadge';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_DETAIL: Record<string, { name: string; title: string; bio: string; skills: string[]; country: string; availability: 'open_for_work' | 'partly_available' | 'unavailable'; verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected'; }> = {
  f1: { name: 'Ariana Chen', title: 'Frontend Engineer', bio: 'Builds modern web applications with clean UX.', skills: ['React', 'TypeScript', 'Testing'], country: 'Canada', availability: 'open_for_work', verificationStatus: 'verified' },
  f2: { name: 'Moussa Diallo', title: 'Product Designer', bio: 'Designs scalable interfaces and systems.', skills: ['Figma', 'UX', 'Prototyping'], country: 'France', availability: 'partly_available', verificationStatus: 'pending' },
  f3: { name: 'Noah Patel', title: 'Fullstack Developer', bio: 'Delivers end-to-end product features.', skills: ['Node.js', 'SQL', 'Cloud'], country: 'India', availability: 'unavailable', verificationStatus: 'unverified' },
};

export function MarketplaceFreelancerDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const profile = MOCK_DETAIL[id];

  if (!profile) return <div className="container section">Freelancer not found.</div>;

  if (!user) {
    return (
      <div className="container section">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <div className="state-box">
          <p>Register or login to view full freelancer profile and contact details.</p>
          <div className="job-actions">
            <Link className="btn btn-primary" to="/register">Register</Link>
            <Link className="btn btn-secondary" to="/login">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section market-page-detail">
      <p className="meta">Freelancers / {profile.name}</p>
      <section className="market-detail-hero info-card">
        <div className="profile-cover" />
        <div className="market-detail-head">
          <div className="market-avatar large">{profile.name.slice(0, 1)}</div>
          <div>
            <h1>{profile.name}</h1>
            <p className="meta">{profile.title} · {profile.country}</p>
            <div className="chip-row">
              <StatusBadge label={profile.availability === 'open_for_work' ? 'Open for work' : profile.availability === 'partly_available' ? 'Partly available' : 'Unavailable'} tone={profile.availability === 'open_for_work' ? 'success' : profile.availability === 'partly_available' ? 'warning' : 'muted'} />
              <StatusBadge label="Active" tone="success" />
              <VerificationBadge status={profile.verificationStatus} />
            </div>
          </div>
          <div className="job-actions">
            <button type="button" className="btn btn-primary">Contact</button>
            <button type="button" className="btn btn-ghost">Add to favourite</button>
          </div>
        </div>
      </section>

      <section className="info-card"><h3>About</h3><p>{profile.bio}</p></section>
      <section className="info-card"><h3>Experience</h3><p>7+ years across freelance product delivery and cross-functional teams.</p></section>
      <section className="info-card"><h3>Attachments</h3><div className="upload-box">Portfolio and references can appear here.</div></section>
      <section className="info-card"><h3>Skills</h3><div className="chip-row">{profile.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}</div></section>
      <section className="info-card"><h3>Related projects</h3><p>Project cards placeholder.</p></section>
      <section className="info-card"><h3>Related jobs</h3><p>Related jobs placeholder.</p></section>
    </div>
  );
}
