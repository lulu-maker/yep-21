import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Outlet />
      </section>
    </main>
  );
}
