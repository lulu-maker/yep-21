interface RatingSummaryProps {
  averageRating: number;
  reviewCount: number;
}

export function RatingSummary({ averageRating, reviewCount }: RatingSummaryProps) {
  return (
    <div className="rating-summary">
      <strong>{reviewCount ? averageRating.toFixed(1) : '—'}</strong>
      <span>★</span>
      <p>{reviewCount ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}` : 'No reviews yet'}</p>
    </div>
  );
}
