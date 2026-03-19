interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  formatLabel?: (value: string) => string;
}

export function CheckboxGroup({ options, selected, onToggle, formatLabel }: CheckboxGroupProps) {
  return (
    <div className="filter-checkbox-group">
      {options.map((item) => (
        <label key={item} className="filter-checkbox-item">
          <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
          <span>{formatLabel ? formatLabel(item) : item}</span>
        </label>
      ))}
    </div>
  );
}
