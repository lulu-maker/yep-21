export function SearchToolbar({
  query,
  onQuery,
  sort,
  onSort,
  resultCount,
}: {
  query: string;
  onQuery: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
  resultCount: number;
}) {
  return (
    <section className="search-toolbar">
      <div className="search-toolbar-top">
        <h2>Projects & Jobs</h2>
        <p className="result-count-pill" aria-live="polite">
          {resultCount} results
        </p>
      </div>
      <div className="search-toolbar-controls">
        <label className="market-search-inline toolbar-search">
          <span>🔎</span>
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by project title, skills, company"
          />
        </label>

        <label className="toolbar-sort">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
        </label>
      </div>
    </section>
  );
}
