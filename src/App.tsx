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
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { ClientNotificationsPage } from './pages/client/ClientNotificationsPage';
import { ClientOnboardingPage } from './pages/client/ClientOnboardingPage';
import { ClientProposalsPage } from './pages/client/ClientProposalsPage';
import { ClientSettingsPage } from './pages/client/ClientSettingsPage';
import { ClientContractsPage } from './pages/client/ClientContractsPage';
import { ClientMessagesPage } from './pages/client/ClientMessagesPage';
import { ClientJobCreatePage } from './pages/client/jobs/ClientJobCreatePage';
import { ClientJobDetailPage } from './pages/client/jobs/ClientJobDetailPage';
import { ClientJobEditPage } from './pages/client/jobs/ClientJobEditPage';
import { ClientJobsPage } from './pages/client/jobs/ClientJobsPage';
import { FreelancerAccountPage } from './pages/freelancer/FreelancerAccountPage';
import { FreelancerContractsPage } from './pages/freelancer/FreelancerContractsPage';
import { FreelancerDashboardPage } from './pages/freelancer/FreelancerDashboardPage';
import { FreelancerMessagesPage } from './pages/freelancer/FreelancerMessagesPage';
import { FreelancerNotificationsPage } from './pages/freelancer/FreelancerNotificationsPage';
import { FreelancerOnboardingPage } from './pages/freelancer/FreelancerOnboardingPage';
import { FreelancerSettingsPage } from './pages/freelancer/FreelancerSettingsPage';
import { FreelancerJobDetailPage } from './pages/freelancer/jobs/FreelancerJobDetailPage';
import { FreelancerJobsPage } from './pages/freelancer/jobs/FreelancerJobsPage';
import { FreelancerProposalsPage } from './pages/freelancer/jobs/FreelancerProposalsPage';

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
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/client/onboarding" element={<ClientOnboardingPage />} />
            <Route path="/client/account" element={<ClientAccountPage />} />
            <Route path="/client/jobs" element={<ClientJobsPage />} />
            <Route path="/client/jobs/new" element={<ClientJobCreatePage />} />
            <Route path="/client/jobs/:id" element={<ClientJobDetailPage />} />
            <Route path="/client/jobs/:id/edit" element={<ClientJobEditPage />} />
            <Route path="/client/proposals" element={<ClientProposalsPage />} />
            <Route path="/client/contracts" element={<ClientContractsPage />} />
            <Route path="/client/messages" element={<ClientMessagesPage />} />
            <Route path="/client/notifications" element={<ClientNotificationsPage />} />
            <Route path="/client/settings" element={<ClientSettingsPage />} />
          </Route>
        </Route>

        <Route element={<RequireFreelancer />}>
          <Route element={<FreelancerLayout />}>
            <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
            <Route path="/freelancer/onboarding" element={<FreelancerOnboardingPage />} />
            <Route path="/freelancer/account" element={<FreelancerAccountPage />} />
            <Route path="/freelancer/jobs" element={<FreelancerJobsPage />} />
            <Route path="/freelancer/jobs/:id" element={<FreelancerJobDetailPage />} />
            <Route path="/freelancer/proposals" element={<FreelancerProposalsPage />} />
            <Route path="/freelancer/contracts" element={<FreelancerContractsPage />} />
            <Route path="/freelancer/messages" element={<FreelancerMessagesPage />} />
            <Route path="/freelancer/notifications" element={<FreelancerNotificationsPage />} />
            <Route path="/freelancer/settings" element={<FreelancerSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
