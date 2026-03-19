import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StatusBadge } from '../../components/marketplace/StatusBadge';
import { VerificationBadge } from '../../components/marketplace/VerificationBadge';
import { useAuth } from '../../contexts/AuthContext';
import { getEntityReviews } from '../../api/reviewsApi';
import { RatingSummary } from '../../components/trust/RatingSummary';
import { ReviewCard } from '../../components/trust/ReviewCard';
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs';
import { MOCK_FREELANCERS } from '../../data/mockFreelancers';
import { getSavedItems, toggleSavedFreelancer } from '../../api/savedItemsApi';

const MOCK_DETAIL: Record<string, { name: string; title: string; bio: string; skills: string[]; country: string; availability: 'open_for_work' | 'partly_available' | 'unavailable'; verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected'; }> = Object.fromEntries(
  MOCK_FREELANCERS.map((item) => [item.id, { ...item, bio: 'Delivers strong execution and clear communication across engagements.', skills: ['Communication', 'Delivery', 'Ownership'] }]),
);

export function MarketplaceFreelancerDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const profile = MOCK_DETAIL[id];
  const [reviews, setReviews] = useState<{ averageRating: number; reviewCount: number; items: any[] }>({ averageRating: 0, reviewCount: 0, items: [] });
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    void (async () => {
      setIsReviewLoading(true);
      const data = await getEntityReviews('freelancer', id);
      setReviews(data as any);
      setIsReviewLoading(false);
      if (user) {
        const saved = await getSavedItems(user.id);
        setIsSaved(saved.freelancers.includes(id));
      }
    })();
  }, [id, profile, user?.id]);

  const onToggleFavorite = async () => {
    if (!user) return;
    const next = await toggleSavedFreelancer(user.id, id);
    setIsSaved(next.freelancers.includes(id));
  };

  if (!profile) return <div className="container section">Freelancer not found.</div>;

  if (!user) {
    return (
      <div className="container section">
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <div className="state-box">
          <p>Register or login to view full freelancer profile and contact details.</p>
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
      <Breadcrumbs items={[{ label: 'Freelancers', to: '/freelancers' }, { label: profile.name }]} />
      <section className="market-detail-hero info-card">
        <div className="profile-cover" />
        <div className="market-detail-head">
          <div className="market-avatar large">{profile.name.slice(0, 1)}</div>
          <div>
            <h1>{profile.name}</h1>
            <p className="meta">{profile.title} · {profile.country}</p>
            <div className="chip-row">
              <StatusBadge label={profile.availability === 'open_for_work' ? 'Open for work' : profile.availability === 'partly_available' ? 'Partly available' : 'Unavailable'} tone={profile.availability === 'open_for_work' ? 'success' : profile.availability === 'partly_available' ? 'warning' : 'muted'} />
              <StatusBadge label="Active" tone="success" />
              <VerificationBadge status={profile.verificationStatus} />
            </div>
          </div>
          <div className="job-actions">
            <button type="button" className="btn btn-primary">Contact</button>
            <button type="button" className="btn btn-ghost" onClick={() => void onToggleFavorite()}>
              {isSaved ? 'Saved to favorites' : 'Save freelancer'}
            </button>
          </div>
        </div>
      </section>

      <section className="info-card"><h3>Trust score</h3><RatingSummary averageRating={reviews.averageRating} reviewCount={reviews.reviewCount} /></section>
      <section className="info-card"><h3>About</h3><p>{profile.bio}</p></section>
      <section className="info-card"><h3>Experience</h3><p>7+ years across freelance product delivery and cross-functional teams.</p></section>
      <section className="info-card"><h3>Attachments</h3><div className="upload-box">Portfolio and references can appear here.</div></section>
      <section className="info-card"><h3>Skills</h3><div className="chip-row">{profile.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}</div></section>
      <section className="info-card reviews-panel">
        <h3>Reviews</h3>
        {isReviewLoading ? <p className="meta">Loading reviews…</p> : null}
        {!isReviewLoading && reviews.items.length ? reviews.items.slice(0, 3).map((item) => <ReviewCard key={item.id} review={item} />) : null}
        {!isReviewLoading && !reviews.items.length ? <div className="state-box compact"><p>No reviews yet for this freelancer.</p></div> : null}
      </section>
      <section className="info-card"><h3>Related projects</h3><p>Project cards placeholder.</p></section>
      <section className="info-card"><h3>Related jobs</h3><p>Related jobs placeholder.</p></section>
    </div>
  );
}
