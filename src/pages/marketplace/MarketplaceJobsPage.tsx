import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActiveFilterChips } from '../../components/marketplace/ActiveFilterChips';
import { FilterSection } from '../../components/marketplace/FilterSection';
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero';
import { MarketplaceResultCard } from '../../components/marketplace/MarketplaceResultCard';
import { SearchToolbar } from '../../components/marketplace/SearchToolbar';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Job } from '../../types/job';

type FilterMap = {
  workplace: string[];
  contractType: string[];
  publicationDate: string[];
  industry: string[];
  fields: string[];
  country: string[];
  keywords: string[];
};

const INITIAL_FILTERS: FilterMap = {
  workplace: [],
  contractType: [],
  publicationDate: [],
  industry: [],
  fields: [],
  country: [],
  keywords: [],
};

function daysAgoLabel(date: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)));
  return days === 0 ? 'today' : `${days}d ago`;
}

function parseDaysFilter(value: string) {
  if (value === 'today') return 1;
  return Number(value);
}

export function MarketplaceJobsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Job[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState<FilterMap>(INITIAL_FILTERS);
  const [keywordInput, setKeywordInput] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await getMarketplaceJobs({ page: 1, pageSize: user ? 50 : 10 });
      setItems(response.items);
    })();
  }, [user?.id]);

  const mapItem = (job: Job) => {
    const workplaceType = job.experienceLevel === 'entry' ? 'Remote' : job.experienceLevel === 'intermediate' ? 'Hybrid' : 'On-site';
    const contractType = job.budgetMax > 5000 ? 'Agency contract' : job.budgetMax > 2500 ? 'Freelance' : 'Permanent';
    const duration = job.experienceLevel === 'expert' ? '6+ months' : job.experienceLevel === 'intermediate' ? '3 months' : '1 month';
    const companyName = `${job.category || 'General'} Studio`;

    return {
      ...job,
      companyName,
      workplaceType,
      contractType,
      duration,
      startTiming: job.status === 'open' ? 'ASAP' : 'Flexible',
      postedLabel: daysAgoLabel(job.createdAt),
      locationLabel: `${job.category || 'Global'} · Worldwide`,
      isSaved: false,
    };
  };

  const prepared = useMemo(() => items.map(mapItem), [items]);

  const filtered = useMemo(() => {
    const apply = prepared
      .filter((item) => `${item.title} ${item.description} ${item.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()))
      .filter((item) => (filters.workplace.length ? filters.workplace.includes(item.workplaceType.toLowerCase()) : true))
      .filter((item) => (filters.contractType.length ? filters.contractType.includes(item.contractType.toLowerCase()) : true))
      .filter((item) => (filters.industry.length ? filters.industry.some((industry) => (item.category ?? '').toLowerCase().includes(industry)) : true))
      .filter((item) => (filters.fields.length ? filters.fields.some((field) => item.skills.join(' ').toLowerCase().includes(field)) : true))
      .filter((item) => (filters.country.length ? filters.country.some((country) => item.locationLabel.toLowerCase().includes(country)) : true))
      .filter((item) => (filters.keywords.length ? filters.keywords.some((keyword) => `${item.title} ${item.description}`.toLowerCase().includes(keyword)) : true))
      .filter((item) => {
        if (!filters.publicationDate.length) return true;
        const age = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return filters.publicationDate.some((value) => age <= parseDaysFilter(value));
      });

    const sorted = [...apply];
    if (sort === 'name_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'name_desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [prepared, query, filters, sort]);

  const activeChips = useMemo(
    () => [query ? `search:${query}` : '', ...Object.values(filters).flat().map((item) => item.toString())].filter(Boolean),
    [filters, query],
  );

  const toggleFilter = (group: keyof FilterMap, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value) ? prev[group].filter((item) => item !== value) : [...prev[group], value],
    }));
  };

  const removeChip = (chip: string) => {
    if (chip.startsWith('search:')) {
      setQuery('');
      return;
    }

    setFilters((prev) => {
      const next = { ...prev };
      (Object.keys(next) as Array<keyof FilterMap>).forEach((key) => {
        next[key] = next[key].filter((item) => item !== chip);
      });
      return next;
    });
  };

  const resetAll = () => {
    setQuery('');
    setFilters(INITIAL_FILTERS);
    setKeywordInput('');
  };

  const addKeyword = () => {
    const value = keywordInput.trim().toLowerCase();
    if (!value) return;
    setFilters((prev) => ({ ...prev, keywords: prev.keywords.includes(value) ? prev.keywords : [...prev.keywords, value] }));
    setKeywordInput('');
  };

  return (
    <div className="container section market-page">
      <MarketplaceHero title="Projects marketplace" subtitle="Filter and discover opportunities with rich project metadata." />

      <SearchToolbar query={query} onQuery={setQuery} sort={sort} onSort={setSort} resultCount={filtered.length} />
      <ActiveFilterChips chips={activeChips} onRemove={removeChip} onReset={resetAll} />

      {!user ? (
        <div className="state-box">
          <p>Sign up to unlock full project details and direct interactions.</p>
          <Link className="btn btn-primary" to="/register">Create account</Link>
        </div>
      ) : null}

      <button type="button" className="btn btn-secondary market-mobile-filter-btn" onClick={() => setMobileFiltersOpen((prev) => !prev)}>
        {mobileFiltersOpen ? 'Hide filters' : 'Show filters'}
      </button>

      <div className="discovery-layout">
        <aside className={`filter-sidebar ${mobileFiltersOpen ? 'open' : ''}`}>
          <FilterSection title="Workplace">
            {['remote', 'hybrid', 'on-site'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.workplace.includes(item)} onChange={() => toggleFilter('workplace', item)} /> {item}</label>
            ))}
          </FilterSection>

          <FilterSection title="Contract type">
            {['freelance', 'agency contract', 'permanent'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.contractType.includes(item)} onChange={() => toggleFilter('contractType', item)} /> {item}</label>
            ))}
          </FilterSection>

          <FilterSection title="Publication date">
            {['today', '7', '12', '18', '24', '30'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.publicationDate.includes(item)} onChange={() => toggleFilter('publicationDate', item)} /> {item}</label>
            ))}
          </FilterSection>

          <FilterSection title="Industry">
            {['design', 'development', 'marketing', 'finance'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.industry.includes(item)} onChange={() => toggleFilter('industry', item)} /> {item}</label>
            ))}
            <button type="button" className="text-link">show more</button>
          </FilterSection>

          <FilterSection title="Keywords">
            <div className="job-actions">
              <input value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} placeholder="Add keyword" />
              <button type="button" className="btn btn-secondary" onClick={addKeyword}>Add</button>
            </div>
          </FilterSection>

          <FilterSection title="Professional fields">
            {['frontend', 'backend', 'design', 'qa'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.fields.includes(item)} onChange={() => toggleFilter('fields', item)} /> {item}</label>
            ))}
            <button type="button" className="text-link">show more</button>
          </FilterSection>

          <FilterSection title="Country">
            {['canada', 'france', 'india', 'usa'].map((item) => (
              <label key={item}><input type="checkbox" checked={filters.country.includes(item)} onChange={() => toggleFilter('country', item)} /> {item.toUpperCase()}</label>
            ))}
            <button type="button" className="text-link">show more</button>
          </FilterSection>

          <FilterSection title="Search options">
            <label><input type="checkbox" /> Exclude selected countries</label>
            <label><input type="checkbox" /> Include regional remote projects</label>
          </FilterSection>
        </aside>

        <section className="results-column">
          {filtered.map((item) => (
            <MarketplaceResultCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </div>
  );
}
