import type { ReactNode } from 'react';

export function FilterDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="filter-drawer-backdrop" onClick={onClose}>
      <aside className="filter-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="filter-drawer-head">
          <h2>Filters</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}
