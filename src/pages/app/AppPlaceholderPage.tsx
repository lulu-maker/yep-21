interface AppPlaceholderPageProps {
  title: string;
  description: string;
}

export function AppPlaceholderPage({ title, description }: AppPlaceholderPageProps) {
  return (
    <div className="container account-grid">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <div className="info-card">
        <p>{description}</p>
      </div>
    </div>
  );
}
