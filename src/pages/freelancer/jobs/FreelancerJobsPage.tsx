import { useEffect, useMemo, useState } from 'react';
import { getMarketplaceJobs } from '../../../api/jobsApi';
import { JobCard } from '../../../components/jobs/JobCard';
import type { Job } from '../../../types/job';

export function FreelancerJobsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<Job['experienceLevel'] | ''>('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      search,
      category,
      experienceLevel,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      page,
      pageSize: 6,
    }),
    [search, category, experienceLevel, budgetMin, budgetMax, page],
  );

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMarketplaceJobs(query);
      setItems(response.items);
      setTotalPages(response.totalPages);
    } catch {
      setError('Unable to load marketplace jobs. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [query]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setExperienceLevel('');
    setBudgetMin('');
    setBudgetMax('');
    setPage(1);
  };

  return (
    <div className="container account-grid">
      <h1>Browse Jobs</h1>

      <section className="info-card form-stack">
        <div className="two-col-grid">
          <label>
            Search jobs
            <input
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Category (optional)
            <input
              placeholder="e.g. Development"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Experience level
            <select
              value={experienceLevel}
              onChange={(e) => {
                setExperienceLevel(e.target.value as Job['experienceLevel'] | '');
                setPage(1);
              }}
            >
              <option value="">All levels</option>
              <option value="entry">Entry</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </label>

          <div className="two-col-grid">
            <label>
              Budget min
              <input
                type="number"
                min={1}
                value={budgetMin}
                onChange={(e) => {
                  setBudgetMin(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label>
              Budget max
              <input
                type="number"
                min={1}
                value={budgetMax}
                onChange={(e) => {
                  setBudgetMax(e.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>
        </div>

        <div className="job-actions">
          <button type="button" className="btn btn-secondary" onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="card-grid" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="info-card" aria-hidden="true">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </article>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="state-box">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={() => void load()}>
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <div className="state-box">
          <p>No jobs match your filters.</p>
        </div>
      ) : null}

      {!isLoading && !error && items.length > 0 ? (
        <>
          <div className="card-grid">
            {items.map((job) => (
              <JobCard key={job.id} job={job} view="freelancer" />
            ))}
          </div>

          <div className="job-actions">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <p className="meta">
              Page {page} of {totalPages}
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
