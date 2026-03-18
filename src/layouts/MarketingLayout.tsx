import { Outlet } from 'react-router-dom';
import { NewsletterSection } from '../components/NewsletterSection';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';

export function MarketingLayout() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <NewsletterSection />
      <SiteFooter />
    </div>
  );
}
