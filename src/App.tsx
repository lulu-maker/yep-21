import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './components/guards/RequireAuth';
import { RequireClient } from './components/guards/RequireClient';
import { RequireFreelancer } from './components/guards/RequireFreelancer';
import { RequireGuest } from './components/guards/RequireGuest';
import { AuthLayout } from './layouts/AuthLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { FreelancerLayout } from './layouts/FreelancerLayout';
import { MarketingLayout } from './layouts/MarketingLayout';
import { AboutPage } from './pages/AboutPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogPage } from './pages/BlogPage';
import { HomePage } from './pages/HomePage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { ClientAccountPage } from './pages/client/ClientAccountPage';
import { ClientOnboardingPage } from './pages/client/ClientOnboardingPage';
import { ClientSettingsPage } from './pages/client/ClientSettingsPage';
import { FreelancerAccountPage } from './pages/freelancer/FreelancerAccountPage';
import { FreelancerOnboardingPage } from './pages/freelancer/FreelancerOnboardingPage';
import { FreelancerSettingsPage } from './pages/freelancer/FreelancerSettingsPage';

export function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
      </Route>

      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireClient />}>
          <Route element={<ClientLayout />}>
            <Route path="/client/onboarding" element={<ClientOnboardingPage />} />
            <Route path="/client/account" element={<ClientAccountPage />} />
            <Route path="/client/settings" element={<ClientSettingsPage />} />
          </Route>
        </Route>

        <Route element={<RequireFreelancer />}>
          <Route element={<FreelancerLayout />}>
            <Route path="/freelancer/onboarding" element={<FreelancerOnboardingPage />} />
            <Route path="/freelancer/account" element={<FreelancerAccountPage />} />
            <Route path="/freelancer/settings" element={<FreelancerSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
