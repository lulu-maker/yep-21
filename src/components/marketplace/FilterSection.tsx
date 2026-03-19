import type { ReactNode } from 'react';

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="filter-section-card">
      <h3 className="filter-section-title">{title}</h3>
      <div className="filter-section-body">{children}</div>
    </section>
  );
}
