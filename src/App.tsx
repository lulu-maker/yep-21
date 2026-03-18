import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout } from './layouts/MarketingLayout';
import { AboutPage } from './pages/AboutPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogPage } from './pages/BlogPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
