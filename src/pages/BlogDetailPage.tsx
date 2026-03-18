import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogPostById } from '../api/blogApi';
import type { BlogPost } from '../types/blog';

export function BlogDetailPage() {
  const { id = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      const item = await getBlogPostById(id);
      if (active) {
        setPost(item);
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <article className="info-card skeleton" aria-hidden="true">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </article>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="section">
        <div className="container state-box">
          <p>Blog post not found.</p>
          <Link to="/blog" className="btn btn-secondary">
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container blog-detail">
        <p className="meta">
          {post.category} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <article>
          <p>{post.content}</p>
        </article>
      </div>
    </section>
  );
}
