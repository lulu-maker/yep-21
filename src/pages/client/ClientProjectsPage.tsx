import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContracts } from '../../api/contractsApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Contract } from '../../types/contract';

const PAGE_SIZE = 5;

export function ClientProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Contract[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const response = await getContracts(user.id, 'client');
      setItems(response.items);
    })();
  }, [user?.id]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = useMemo(() => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [items, page]);

  return (
    <div className="container profile-page">
      <div className="profile-page-head">
        <h2>My Projects</h2>
        <Link to="/client/projects/new" className="btn btn-primary">Add Project</Link>
      </div>

      <section className="info-card">
        {items.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Created</th>
                  <th>Earned</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id}>
                    <td>Project #{item.id.slice(0, 8)}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>${item.bidAmount}</td>
                    <td><span className={`status-badge status-${item.status === 'active' ? 'accepted' : 'rejected'}`}>{item.status}</span></td>
                    <td><Link to="/client/projects/new" className="text-link">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pagination-row">
          <button type="button" className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Previous</button>
          <span className="meta">Page {page} / {totalPages}</span>
          <button type="button" className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Next</button>
        </div>
      </section>
    </div>
  );
}
