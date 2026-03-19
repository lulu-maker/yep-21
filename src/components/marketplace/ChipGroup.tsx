interface ChipGroupProps {
  chips: Array<{ value: string; label: string }>;
  active: string[];
  onToggle?: (value: string) => void;
  onRemove?: (value: string) => void;
}

export function ChipGroup({ chips, active, onToggle, onRemove }: ChipGroupProps) {
  return (
    <div className="chip-row chip-group-wrap">
      {chips.map((chip) => {
        const isActive = active.includes(chip.value);
        return (
          <button
            key={chip.value}
            type="button"
            className={`chip ${isActive ? 'chip-selected' : ''} ${onRemove ? 'chip-action' : ''}`}
            onClick={() => (onRemove ? onRemove(chip.value) : onToggle?.(chip.value))}
          >
            {chip.label}
            {onRemove ? ' ✕' : ''}
          </button>
        );
      })}
    </div>
  );
}
