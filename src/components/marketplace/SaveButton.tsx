export function SaveButton({
  isSaved,
  onToggle,
}: {
  isSaved: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`save-btn ${isSaved ? 'saved' : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={isSaved}
    >
      {isSaved ? '★ Saved' : '☆ Save'}
    </button>
  );
}
