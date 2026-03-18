interface MarketplaceHeroProps {
  title: string;
  subtitle: string;
}

export function MarketplaceHero({ title, subtitle }: MarketplaceHeroProps) {
  return (
    <section className="marketplace-hero">
      <div>
        <p className="eyebrow">Marketplace</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="marketplace-hero-visual" aria-hidden="true" />
    </section>
  );
}
