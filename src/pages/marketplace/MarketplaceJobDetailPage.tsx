import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MarketplaceHero } from '../../components/marketplace/MarketplaceHero';
import { StatusBadge } from '../../components/marketplace/StatusBadge';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import { getMarketplaceJobById } from '../../api/jobsApi';
import { useAuth } from '../../contexts/AuthContext';
import { getEntityReviews } from '../../api/reviewsApi';
import { RatingSummary } from '../../components/trust/RatingSummary';
import { ReviewCard } from '../../components/trust/ReviewCard';
import type { Job } from '../../types/job';

export function MarketplaceJobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [reviews, setReviews] = useState<{ averageRating: number; reviewCount: number; items: any[] }>({ averageRating: 0, reviewCount: 0, items: [] });

  useEffect(() => {
    void (async () => {
      const item = await getMarketplaceJobById(id);
      setJob(item);
      const reviewsData = await getEntityReviews('client', item.clientId);
      setReviews(reviewsData as any);
    })();
  }, [id]);

  if (!job) return <div className="container section">Loading job...</div>;

  if (!user) {
    return (
      <div className="container section">
        <MarketplaceHero title={job.title} subtitle={`${job.category || 'General'} · ${job.experienceLevel}`} />
        <div className="state-box">
          <p>Create an account to view full details and apply.</p>
          <div className="job-actions">
            <Link className="btn btn-primary" to="/register">Register</Link>
            <Link className="btn btn-secondary" to="/login">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section market-page-detail">
      <p className="meta">Jobs / {job.title}</p>
      <section className="market-detail-hero info-card">
        <div className="profile-cover" />
        <div className="market-detail-head">
          <div className="market-avatar large">{job.title.slice(0, 1)}</div>
          <div>
            <h1>{job.title}</h1>
            <p className="meta">{job.category || 'General'} · {job.experienceLevel}</p>
            <div className="chip-row">
              <StatusBadge label={job.status === 'open' ? 'Hiring' : 'Inactive'} tone={job.status === 'open' ? 'success' : 'muted'} />
              <VerificationBadge status="verified" />
            </div>
          </div>
          <div className="job-actions">
            <button type="button" className="btn btn-primary">Apply now</button>
            <button type="button" className="btn btn-ghost">Save</button>
          </div>
        </div>
      </section>

      <section className="info-card">
        <h3>Company trust</h3>
        <RatingSummary averageRating={reviews.averageRating} reviewCount={reviews.reviewCount} />
      </section>

      <section className="info-card">
        <h3>About</h3>
        <p>{job.description}</p>
      </section>
      <section className="info-card">
        <h3>Open positions</h3>
        <p>Budget: ${job.budgetMin} - ${job.budgetMax}</p>
      </section>
      <section className="info-card">
        <h3>Attachments</h3>
        <div className="upload-box">Project brief and documents can be attached here.</div>
      </section>
      <section className="info-card">
        <h3>Tags</h3>
        <div className="chip-row">{job.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}</div>
      </section>

      <section className="info-card">
        <h3>Reviews</h3>
        {reviews.items.length ? reviews.items.slice(0, 3).map((item) => <ReviewCard key={item.id} review={item} />) : <p>No reviews yet.</p>}
      </section>
    </div>
  );
}
