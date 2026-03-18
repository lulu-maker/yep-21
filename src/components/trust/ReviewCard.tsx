import type { Review } from '../../types/review';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="info-card review-card">
      <p className="meta">{new Date(review.createdAt).toLocaleDateString()} · {review.role.replaceAll('_', ' ')}</p>
      <p className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
      <p>{review.comment || 'No comment provided.'}</p>
    </article>
  );
}
