import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActiveFiltersBar } from '../../components/marketplace/ActiveFiltersBar';
import { FilterDrawer } from '../../components/marketplace/FilterDrawer';
import { FilterSidebar } from '../../components/marketplace/FilterSidebar';
import { JobResultCard, type JobResultItem } from '../../components/marketplace/JobResultCard';
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero';
import { SearchToolbar } from '../../components/marketplace/SearchToolbar';
import { getMarketplaceJobs } from '../../api/jobsApi';
import { getSavedItems, toggleSavedJob } from '../../api/savedItemsApi';
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

type SearchOptionMap = {
  excludeSelectedCountries: boolean;
  includeRegionalRemote: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchOptions, setSearchOptions] = useState<SearchOptionMap>({
    excludeSelectedCountries: false,
    includeRegionalRemote: false,
  });
  const [industryExpanded, setIndustryExpanded] = useState(false);
  const [fieldsExpanded, setFieldsExpanded] = useState(false);
  const [countryExpanded, setCountryExpanded] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMarketplaceJobs({ page: 1, pageSize: user ? 50 : 10 });
        setItems(response.items);
        if (user) {
          const saved = await getSavedItems(user.id);
          setSavedJobIds(saved.jobs);
        } else {
          setSavedJobIds([]);
        }
      } catch {
        setError('Unable to load projects. Please retry.');
        setItems([]);
      }
      setIsLoading(false);
    })();
  }, [user?.id, reloadTick]);

  const mapItem = (job: Job): JobResultItem => {
    const workplaceType = job.experienceLevel === 'entry' ? 'Remote' : job.experienceLevel === 'intermediate' ? 'Hybrid' : 'On-site';
    const contractType = job.budgetMax > 5000 ? 'Agency contract' : job.budgetMax > 2500 ? 'Freelance' : 'Permanent';
    const duration = job.experienceLevel === 'expert' ? '6+ months' : job.experienceLevel === 'intermediate' ? '3 months' : '1 month';
    const companyName = `${job.category || 'General'} Studio`;

    return {
      id: job.id,
      companyName,
      companyLogo: '',
      companyVerificationStatus: job.status === 'open' ? 'verified' : 'pending',
      title: job.title,
      summary: job.description,
      tags: [...job.skills, job.category || 'general', job.experienceLevel],
      location: `${job.category || 'Global'} · Worldwide`,
      workplaceType,
      contractType,
      duration,
      budgetMin: job.budgetMin,
      budgetMax: job.budgetMax,
      rateType: 'fixed',
      startTiming: job.status === 'open' ? 'ASAP' : 'Flexible',
      postedAt: daysAgoLabel(job.createdAt),
      createdAt: job.createdAt,
      isSaved: savedJobIds.includes(job.id),
      status: job.status,
    };
  };

  const prepared = useMemo(() => items.map(mapItem), [items, savedJobIds]);

  const filtered = useMemo(() => {
    const apply = prepared
      .filter((item) => `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()))
      .filter((item) => (filters.workplace.length ? filters.workplace.includes(item.workplaceType.toLowerCase()) : true))
      .filter((item) => (filters.contractType.length ? filters.contractType.includes(item.contractType.toLowerCase()) : true))
      .filter((item) => (filters.industry.length ? filters.industry.some((industry) => item.companyName.toLowerCase().includes(industry)) : true))
      .filter((item) => (filters.fields.length ? filters.fields.some((field) => item.tags.join(' ').toLowerCase().includes(field)) : true))
      .filter((item) => (filters.country.length ? filters.country.some((country) => item.location.toLowerCase().includes(country)) : true))
      .filter((item) => (filters.keywords.length ? filters.keywords.some((keyword) => `${item.title} ${item.summary}`.toLowerCase().includes(keyword)) : true))
      .filter((item) => (searchOptions.includeRegionalRemote ? item.workplaceType.toLowerCase() !== 'on-site' : true))
      .filter((item) => (searchOptions.excludeSelectedCountries && filters.country.length
        ? !filters.country.some((country) => item.location.toLowerCase().includes(country))
        : true))
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
  }, [prepared, query, filters, sort, searchOptions]);

  const activeChips = useMemo(() => {
    const chips: Array<{ value: string; label: string }> = [];
    if (query) chips.push({ value: `search:${query}`, label: `Search: ${query}` });
    Object.values(filters).forEach((list) => list.forEach((item) => chips.push({ value: item, label: item })));
    if (searchOptions.excludeSelectedCountries) chips.push({ value: 'option:exclude', label: 'Exclude selected countries' });
    if (searchOptions.includeRegionalRemote) chips.push({ value: 'option:regional', label: 'Regional remote only' });
    return chips;
  }, [filters, query, searchOptions]);

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
    if (chip === 'option:exclude') {
      setSearchOptions((prev) => ({ ...prev, excludeSelectedCountries: false }));
      return;
    }
    if (chip === 'option:regional') {
      setSearchOptions((prev) => ({ ...prev, includeRegionalRemote: false }));
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
    setSearchOptions({ excludeSelectedCountries: false, includeRegionalRemote: false });
    setKeywordInput('');
    setCountrySearch('');
  };

  const addKeyword = () => {
    const value = keywordInput.trim().toLowerCase();
    if (!value) return;
    setFilters((prev) => ({ ...prev, keywords: prev.keywords.includes(value) ? prev.keywords : [...prev.keywords, value] }));
    setKeywordInput('');
  };

  const removeKeyword = (value: string) => {
    setFilters((prev) => ({ ...prev, keywords: prev.keywords.filter((item) => item !== value) }));
  };

  const onToggleSave = async (jobId: string) => {
    if (!user) return;
    const saved = await toggleSavedJob(user.id, jobId);
    setSavedJobIds(saved.jobs);
  };

  const sidebarContent = (
    <FilterSidebar
      filters={filters}
      searchOptions={searchOptions}
      onToggleFilter={toggleFilter}
      onToggleOption={(key, value) => setSearchOptions((prev) => ({ ...prev, [key]: value }))}
      keywordInput={keywordInput}
      onKeywordInput={setKeywordInput}
      onAddKeyword={addKeyword}
      onRemoveKeyword={removeKeyword}
      countrySearch={countrySearch}
      onCountrySearch={setCountrySearch}
      industryExpanded={industryExpanded}
      fieldsExpanded={fieldsExpanded}
      countryExpanded={countryExpanded}
      onExpandIndustry={() => setIndustryExpanded(true)}
      onExpandFields={() => setFieldsExpanded(true)}
      onExpandCountry={() => setCountryExpanded(true)}
    />
  );

  return (
    <div className="container section market-page">
      <MarketplaceHero title="Projects marketplace" subtitle="Filter and discover opportunities with rich project metadata." />

      <SearchToolbar query={query} onQuery={setQuery} sort={sort} onSort={setSort} resultCount={filtered.length} />
      <ActiveFiltersBar chips={activeChips} onRemove={removeChip} onClearAll={resetAll} />

      {!user ? (
        <div className="state-box">
          <p>Sign up to unlock full project details and direct interactions.</p>
          <Link className="btn btn-primary" to="/register">Create account</Link>
        </div>
      ) : null}

      <button type="button" className="btn btn-secondary market-mobile-filter-btn" onClick={() => setMobileFiltersOpen((prev) => !prev)}>
        Show filters
      </button>
      <FilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        {sidebarContent}
      </FilterDrawer>

      <div className="discovery-layout">
        <aside className="filter-sidebar desktop-only">
          {sidebarContent}
        </aside>

        <section className="results-column">
          {isLoading ? <div className="state-box"><p>Loading projects…</p></div> : null}
          {!isLoading && error ? (
            <div className="state-box">
              <p>{error}</p>
              <button type="button" className="btn btn-secondary" onClick={() => setReloadTick((prev) => prev + 1)}>
                Retry
              </button>
            </div>
          ) : null}
          {!isLoading && !error && !filtered.length ? <div className="state-box"><p>No projects matched these filters.</p></div> : null}
          {filtered.map((item) => (
            <JobResultCard key={item.id} item={item} onToggleSave={onToggleSave} />
          ))}
        </section>
      </div>
    </div>
  );
}
