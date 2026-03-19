import { CheckboxGroup } from './CheckboxGroup';
import { ChipGroup } from './ChipGroup';
import { FilterSection } from './FilterSection';
import { ToggleSwitch } from './ToggleSwitch';

interface FilterMap {
  workplace: string[];
  contractType: string[];
  publicationDate: string[];
  industry: string[];
  fields: string[];
  country: string[];
  keywords: string[];
}

interface SearchOptionMap {
  excludeSelectedCountries: boolean;
  includeRegionalRemote: boolean;
}

interface FilterSidebarProps {
  filters: FilterMap;
  searchOptions: SearchOptionMap;
  onToggleFilter: (group: keyof FilterMap, value: string) => void;
  onToggleOption: (key: keyof SearchOptionMap, value: boolean) => void;
  keywordInput: string;
  onKeywordInput: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (value: string) => void;
  countrySearch: string;
  onCountrySearch: (value: string) => void;
  industryExpanded: boolean;
  fieldsExpanded: boolean;
  countryExpanded: boolean;
  onExpandIndustry: () => void;
  onExpandFields: () => void;
  onExpandCountry: () => void;
}

const INDUSTRIES = ['design', 'development', 'marketing', 'finance', 'healthcare', 'education', 'ecommerce'];
const FIELDS = ['frontend', 'backend', 'design', 'qa', 'devops', 'product', 'mobile'];
const COUNTRIES = ['canada', 'france', 'india', 'usa', 'uk', 'germany', 'australia', 'brazil'];

export function FilterSidebar({
  filters,
  searchOptions,
  onToggleFilter,
  onToggleOption,
  keywordInput,
  onKeywordInput,
  onAddKeyword,
  onRemoveKeyword,
  countrySearch,
  onCountrySearch,
  industryExpanded,
  fieldsExpanded,
  countryExpanded,
  onExpandIndustry,
  onExpandFields,
  onExpandCountry,
}: FilterSidebarProps) {
  const visibleIndustries = industryExpanded ? INDUSTRIES : INDUSTRIES.slice(0, 5);
  const visibleFields = fieldsExpanded ? FIELDS : FIELDS.slice(0, 5);
  const filteredCountries = COUNTRIES.filter((item) => item.includes(countrySearch.toLowerCase().trim()));
  const visibleCountries = countryExpanded ? filteredCountries : filteredCountries.slice(0, 5);

  return (
    <div className="filter-sidebar-inner">
      <div className="filter-sidebar-header">
        <h2>Filters</h2>
        <p className="meta">Narrow down projects quickly.</p>
      </div>

      <FilterSection title="Workplace">
        <CheckboxGroup
          options={['remote', 'hybrid', 'on-site']}
          selected={filters.workplace}
          onToggle={(value) => onToggleFilter('workplace', value)}
          formatLabel={(value) => value}
        />
      </FilterSection>

      <FilterSection title="Contract type">
        <CheckboxGroup
          options={['freelance', 'agency contract', 'permanent']}
          selected={filters.contractType}
          onToggle={(value) => onToggleFilter('contractType', value)}
        />
      </FilterSection>

      <FilterSection title="Publication date">
        <ChipGroup
          chips={[
            { value: 'today', label: 'Today' },
            { value: '7', label: '7 days' },
            { value: '14', label: '14 days' },
            { value: '30', label: '30 days' },
          ]}
          active={filters.publicationDate}
          onToggle={(value) => onToggleFilter('publicationDate', value)}
        />
      </FilterSection>

      <FilterSection title="Industry">
        <CheckboxGroup options={visibleIndustries} selected={filters.industry} onToggle={(value) => onToggleFilter('industry', value)} />
        {!industryExpanded ? <button type="button" className="text-link" onClick={onExpandIndustry}>Show more</button> : null}
      </FilterSection>

      <FilterSection title="Keywords">
        <div className="filter-keyword-input">
          <input value={keywordInput} onChange={(event) => onKeywordInput(event.target.value)} placeholder="Add keyword" />
          <button type="button" className="btn btn-secondary" onClick={onAddKeyword}>Add</button>
        </div>
        <ChipGroup
          chips={filters.keywords.map((item) => ({ value: item, label: item }))}
          active={filters.keywords}
          onRemove={onRemoveKeyword}
        />
      </FilterSection>

      <FilterSection title="Professional fields">
        <CheckboxGroup options={visibleFields} selected={filters.fields} onToggle={(value) => onToggleFilter('fields', value)} />
        {!fieldsExpanded ? <button type="button" className="text-link" onClick={onExpandFields}>Show more</button> : null}
      </FilterSection>

      <FilterSection title="Country">
        <input
          className="filter-country-search"
          value={countrySearch}
          onChange={(event) => onCountrySearch(event.target.value)}
          placeholder="Search country"
        />
        <CheckboxGroup options={visibleCountries} selected={filters.country} onToggle={(value) => onToggleFilter('country', value)} />
        {!countryExpanded && filteredCountries.length > 5 ? (
          <button type="button" className="text-link" onClick={onExpandCountry}>Show more</button>
        ) : null}
      </FilterSection>

      <FilterSection title="Search options">
        <div className="toggle-stack">
          <ToggleSwitch
            checked={searchOptions.excludeSelectedCountries}
            onChange={(value) => onToggleOption('excludeSelectedCountries', value)}
            label="Exclude selected countries"
          />
          <ToggleSwitch
            checked={searchOptions.includeRegionalRemote}
            onChange={(value) => onToggleOption('includeRegionalRemote', value)}
            label="Include regional remote projects"
          />
        </div>
      </FilterSection>
    </div>
  );
}
