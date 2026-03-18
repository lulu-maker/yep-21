import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceFilterRow } from '../../components/marketplace/MarketplaceFilterRow';
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero';
import { StatusBadge } from '../../components/marketplace/StatusBadge';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_FREELANCERS = [
  { id: 'f1', name: 'Ariana Chen', title: 'Frontend Engineer', country: 'Canada', availability: 'open_for_work', verificationStatus: 'verified' as const },
  { id: 'f2', name: 'Moussa Diallo', title: 'Product Designer', country: 'France', availability: 'partly_available', verificationStatus: 'pending' as const },
  { id: 'f3', name: 'Noah Patel', title: 'Fullstack Developer', country: 'India', availability: 'unavailable', verificationStatus: 'unverified' as const },
];

const AVAILABILITY_LABEL: Record<string, string> = {
  open_for_work: 'Open for work',
  partly_available: 'Partly available',
  unavailable: 'Unavailable',
};

export function MarketplaceFreelancersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name_asc');

  const filtered = useMemo(() => {
    const base = MOCK_FREELANCERS.filter((item) =>
      `${item.name} ${item.title}`.toLowerCase().includes(search.toLowerCase().trim()),
    ).filter((item) => (category ? item.title.toLowerCase().includes(category) : true));

    return [...base].sort((a, b) => (sort === 'name_desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)));
  }, [search, category, sort]);

  return (
    <div className="container section market-page">
      <MarketplaceHero title="Discover top freelancers" subtitle="Explore verified talent, availability, and role expertise." />
      <MarketplaceFilterRow search={search} onSearch={setSearch} category={category} onCategory={setCategory} sort={sort} onSort={setSort} />

      {!user ? <div className="state-box"><p>Sign up to contact freelancers and unlock full profile details.</p><Link to="/register" className="btn btn-primary">Join now</Link></div> : null}

      <div className="market-layout">
        <div className="market-results">
          {filtered.map((item) => (
            <article key={item.id} className="market-card">
              <div className="market-card-head">
                <div className="market-avatar">{item.name.slice(0, 1)}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p className="meta">{item.title} · {item.country}</p>
                </div>
              </div>
              <div className="chip-row">
                <StatusBadge label={AVAILABILITY_LABEL[item.availability]} tone={item.availability === 'open_for_work' ? 'success' : item.availability === 'partly_available' ? 'warning' : 'muted'} />
                <VerificationBadge status={item.verificationStatus} />
              </div>
              <Link to={`/freelancers/${item.id}`} className="btn btn-secondary">View profile</Link>
            </article>
          ))}
        </div>
        <aside className="market-sidebar info-card">
          <h3>Featured service</h3>
          <p>Upgrade your hiring visibility with promoted company profile placement.</p>
          <button type="button" className="btn btn-primary">Learn more</button>
        </aside>
      </div>
    </div>
  );
}
