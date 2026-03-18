import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_DETAIL: Record<string, { name: string; title: string; bio: string; skills: string[] }> = {
  f1: { name: 'Ariana Chen', title: 'Frontend Engineer', bio: 'Builds modern web applications with clean UX.', skills: ['React', 'TypeScript', 'Testing'] },
  f2: { name: 'Moussa Diallo', title: 'Product Designer', bio: 'Designs scalable interfaces and systems.', skills: ['Figma', 'UX', 'Prototyping'] },
  f3: { name: 'Noah Patel', title: 'Fullstack Developer', bio: 'Delivers end-to-end product features.', skills: ['Node.js', 'SQL', 'Cloud'] },
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
    <div className="container section">
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.bio}</p>
      <p>Skills: {profile.skills.join(', ')}</p>
    </div>
  );
}
