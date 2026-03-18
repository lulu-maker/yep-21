import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_FREELANCERS = [
  { id: 'f1', name: 'Ariana Chen', title: 'Frontend Engineer', skills: ['React', 'TypeScript'] },
  { id: 'f2', name: 'Moussa Diallo', title: 'Product Designer', skills: ['Figma', 'Design Systems'] },
  { id: 'f3', name: 'Noah Patel', title: 'Fullstack Developer', skills: ['Node.js', 'PostgreSQL'] },
];

export function MarketplaceFreelancersPage() {
  const { user } = useAuth();

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Freelancers</h1>
        {!user ? <Link to="/register" className="btn btn-primary">Join to hire</Link> : null}
      </div>
      <div className="card-grid">
        {MOCK_FREELANCERS.map((item) => (
          <article key={item.id} className="info-card">
            <h3>{item.name}</h3>
            <p>{item.title}</p>
            <p className="meta">{item.skills.join(', ')}</p>
            <Link to={`/freelancers/${item.id}`} className="btn btn-secondary">View profile</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
