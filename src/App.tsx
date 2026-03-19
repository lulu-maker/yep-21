import { useEffect, useState } from 'react';
import { apiFetch } from './api';

export default function App() {
  const [health, setHealth] = useState<{ status: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/health/')
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend + Backend connected</h1>
      {error ? <p>{error}</p> : null}
      {health ? <pre>{JSON.stringify(health, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}