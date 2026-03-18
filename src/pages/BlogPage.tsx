import { Link } from 'react-router-dom';
import { useBlogPosts } from '../features/blog/useBlogPosts';

export function BlogPage() {
  const { items, isLoading, error, reload } = useBlogPosts();

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Insights</p>
        <h1>Blog</h1>

        {isLoading ? (
          <div className="blog-list" aria-live="polite">
            {Array.from({ length: 3 }).map((_, index) => (
              <article key={index} className="info-card skeleton" aria-hidden="true">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </article>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="state-box" role="alert">
            <p>{error}</p>
            <button type="button" className="btn btn-secondary" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="state-box">
            <p>No blog posts available yet. Check back soon.</p>
          </div>
        ) : null}

        {!isLoading && !error && items.length > 0 ? (
          <div className="blog-list">
            {items.map((post) => (
              <article key={post.id} className="info-card">
                <p className="meta">
                  {post.category} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h2>
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
