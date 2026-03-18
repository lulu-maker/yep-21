interface DashboardHeroProps {
  name: string;
}

export function DashboardHero({ name }: DashboardHeroProps) {
  return (
    <section className="dashboard-hero">
      <div>
        <p className="eyebrow">Account home</p>
        <h2>Hello {name || 'there'}!</h2>
        <p>Welcome to your yep21 account</p>
      </div>
      <div className="dashboard-hero-visual" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
