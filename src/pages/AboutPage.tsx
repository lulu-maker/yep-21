const roleCards = [
  {
    title: 'For clients',
    description:
      'Post clear briefs, receive relevant proposals, and hire freelancers that match your timeline and budget.',
  },
  {
    title: 'For freelancers',
    description:
      'Showcase your strengths, submit thoughtful proposals, and build long-term client partnerships.',
  },
];

export function AboutPage() {
  return (
    <section className="section">
      <div className="container about-stack">
        <p className="eyebrow">About yep-21</p>
        <h1>We help clients and freelancers do their best work together.</h1>
        <p className="lead">
          yep-21 is a freelance marketplace where businesses post jobs, freelancers submit proposals,
          and contracts start quickly once a match is made.
        </p>

        <div className="mission-grid">
          <article className="info-card">
            <h2>Mission</h2>
            <p>
              Create a transparent, outcomes-focused hiring experience that reduces friction between
              opportunity and delivery.
            </p>
          </article>
          <article className="info-card">
            <h2>Vision</h2>
            <p>
              Become the default platform for high-trust remote collaboration between growing
              companies and independent experts.
            </p>
          </article>
        </div>

        <div className="mission-grid">
          {roleCards.map((role) => (
            <article key={role.title} className="info-card">
              <h2>{role.title}</h2>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
