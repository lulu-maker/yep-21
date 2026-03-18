import { useCallback, useEffect, useState } from 'react';
import { getBlogPosts } from '../../api/blogApi';
import type { BlogPost } from '../../types/blog';

export function useBlogPosts() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getBlogPosts();
      setItems(response.items);
    } catch {
      setError('Unable to load blog posts right now. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, isLoading, error, reload: load };
}
