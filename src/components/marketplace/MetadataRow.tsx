export function MetadataRow({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <dl className="result-metadata-row">
      {items.map((item) => (
        <div key={item.label} className="result-metadata-item">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
