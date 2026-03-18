import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceFilterRow } from '../../components/marketplace/MarketplaceFilterRow';
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero';
import { StatusBadge } from '../../components/marketplace/StatusBadge';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../types/job';

export function MarketplaceJobsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name_asc');

  useEffect(() => {
    void (async () => {
      const response = await getMarketplaceJobs({ page: 1, pageSize: user ? 20 : 8 });
      setItems(response.items);
    })();
  }, [user?.id]);

  const filtered = useMemo(() => {
    const base = items
      .filter((item) => (category ? (item.category ?? '').toLowerCase().includes(category) : true))
      .filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase().trim()));

    return [...base].sort((a, b) =>
      sort === 'name_desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title),
    );
  }, [items, category, search, sort]);

  return (
    <div className="container section market-page">
      <MarketplaceHero title="Find your next project partner" subtitle="Browse active companies, projects, and hiring opportunities." />
      <MarketplaceFilterRow search={search} onSearch={setSearch} category={category} onCategory={setCategory} sort={sort} onSort={setSort} />

      {!user ? (
        <div className="state-box">
          <p>Sign up to unlock full project details and direct interactions.</p>
          <Link className="btn btn-primary" to="/register">Create account</Link>
        </div>
      ) : null}

      <div className="market-layout">
        <div className="market-results">
          {filtered.map((job) => (
            <article key={job.id} className="market-card">
              <div className="market-card-head">
                <div className="market-avatar">{job.title.slice(0, 1)}</div>
                <div>
                  <h3>{job.title}</h3>
                  <p className="meta">{job.category || 'General'} · {job.experienceLevel}</p>
                </div>
              </div>
              <p>{job.description.slice(0, 140)}...</p>
              <div className="chip-row">
                <StatusBadge label={job.status === 'open' ? 'Hiring' : 'Inactive'} tone={job.status === 'open' ? 'success' : 'muted'} />
                <StatusBadge label="Active" tone="success" />
                <VerificationBadge status="verified" />
              </div>
              <Link to={`/jobs/${job.id}`} className="btn btn-secondary">Open detail</Link>
            </article>
          ))}
        </div>
        <aside className="market-sidebar info-card">
          <h3>Promoted</h3>
          <p>Post your project to get qualified freelancer proposals faster.</p>
          <Link to={user ? '/client/projects/new' : '/register'} className="btn btn-primary">Post a project</Link>
        </aside>
      </div>
    </div>
  );
}
