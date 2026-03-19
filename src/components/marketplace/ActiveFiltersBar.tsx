import { ChipGroup } from './ChipGroup';

export function ActiveFiltersBar({
  chips,
  onRemove,
  onClearAll,
}: {
  chips: Array<{ value: string; label: string }>;
  onRemove: (value: string) => void;
  onClearAll: () => void;
}) {
  if (!chips.length) return null;

  return (
    <section className="active-filters-bar">
      <div className="active-filters-main">
        <p className="meta">Active filters ({chips.length})</p>
        <ChipGroup chips={chips} active={chips.map((item) => item.value)} onRemove={onRemove} />
      </div>
      <button type="button" className="btn btn-ghost active-filters-clear" onClick={onClearAll}>
        Clear all filters
      </button>
    </section>
  );
}
