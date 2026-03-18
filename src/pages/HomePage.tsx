import { Link } from 'react-router-dom';

const categories = ['Development', 'Design', 'Marketing', 'Writing', 'Data & AI', 'Admin Support'];

const steps = [
  { title: 'Post your job', description: 'Describe outcomes, budget, and timeline in minutes.' },
  { title: 'Review proposals', description: 'Compare talent by skills, history, and fit for your brief.' },
  { title: 'Start contract', description: 'Hire confidently with milestones and transparent collaboration.' },
];

const featured = [
  {
    title: 'Senior React Engineer for SaaS Dashboard',
    meta: 'Fixed price · 3 to 6 months · Expert',
  },
  {
    title: 'Brand Designer for Fintech Product Launch',
    meta: 'Hourly · 30+ hrs/week · Intermediate+',
  },
];

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">Freelance marketplace built for outcomes</p>
            <h1>Hire top freelancers. Find meaningful work. Grow faster together.</h1>
            <p className="lead">
              yep-21 connects ambitious clients with proven freelancers across product, growth, and
              operations.
            </p>
            <div className="hero-actions">
              <a href="/register?role=client" className="btn btn-primary">
                Find talent
              </a>
              <a href="/jobs" className="btn btn-secondary">
                Find work
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Popular categories</h2>
          <div className="chip-grid" role="list">
            {categories.map((category) => (
              <span key={category} className="chip" role="listitem">
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>How yep-21 works</h2>
          <div className="card-grid">
            {steps.map((step, index) => (
              <article key={step.title} className="info-card">
                <p className="step">0{index + 1}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container trust-panel">
          <h2>Trusted by teams building quickly</h2>
          <p>
            “We hired two specialists in under one week and shipped our new customer portal on time.”
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Featured opportunities</h2>
            <Link to="/blog" className="text-link">
              Explore platform stories
            </Link>
          </div>
          <div className="card-grid">
            {featured.map((job) => (
              <article key={job.title} className="info-card">
                <h3>{job.title}</h3>
                <p>{job.meta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
