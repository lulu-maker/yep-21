import type { ReactNode } from 'react';
import { useState } from 'react';

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="filter-section">
      <button type="button" className="filter-section-toggle" onClick={() => setIsOpen((prev) => !prev)}>
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen ? <div className="filter-section-body">{children}</div> : null}
    </section>
  );
}
