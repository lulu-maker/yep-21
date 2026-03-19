export function TagChipList({ tags }: { tags: string[] }) {
  const visible = tags.slice(0, 6);
  const overflow = Math.max(0, tags.length - visible.length);

  return (
    <div className="result-tag-row">
      {visible.map((tag) => (
        <span key={tag} className="chip compact">{tag}</span>
      ))}
      {overflow ? <span className="chip compact">+{overflow} more</span> : null}
    </div>
  );
}
