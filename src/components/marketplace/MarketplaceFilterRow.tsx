import type { ChangeEvent } from 'react';

interface MarketplaceFilterRowProps {
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
}

export function MarketplaceFilterRow({
  search,
  onSearch,
  category,
  onCategory,
  sort,
  onSort,
}: MarketplaceFilterRowProps) {
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value);

  return (
    <div className="market-filter-row">
      <label className="market-search-inline">
        <span>🔎</span>
        <input value={search} onChange={onSearchChange} placeholder="Search jobs & people" />
      </label>
      <select value={category} onChange={(event) => onCategory(event.target.value)}>
        <option value="">All categories</option>
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="marketing">Marketing</option>
      </select>
      <select value={sort} onChange={(event) => onSort(event.target.value)}>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
      </select>
      <button type="button" className="btn btn-secondary">More filters</button>
    </div>
  );
}
