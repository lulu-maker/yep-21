export function ActiveFilterChips({
  chips,
  onRemove,
  onReset,
}: {
  chips: string[];
  onRemove: (chip: string) => void;
  onReset: () => void;
}) {
  if (!chips.length) {
    return null;
  }

  return (
    <div className="active-filters-row">
      {chips.map((chip) => (
        <button key={chip} type="button" className="chip chip-action" onClick={() => onRemove(chip)}>
          {chip} ✕
        </button>
      ))}
      <button type="button" className="text-link" onClick={onReset}>
        Reset all
      </button>
    </div>
  );
}
