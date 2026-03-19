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
      <ChipGroup chips={chips} active={chips.map((item) => item.value)} onRemove={onRemove} />
      <button type="button" className="text-link" onClick={onClearAll}>
        Clear all filters
      </button>
    </section>
  );
}
