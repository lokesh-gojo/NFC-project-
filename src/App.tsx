import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'

// Marketing & Public Pages
import { HomePage } from '@/pages/marketing/HomePage'
import { SolutionsPage } from '@/pages/marketing/SolutionsPage'
import { PricingPage } from '@/pages/marketing/PricingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { BusinessProfilePage } from '@/pages/public/BusinessProfilePage'
import { DigitalMenuPage } from '@/pages/public/DigitalMenuPage'
import { SmartLinkRedirectPage } from '@/pages/public/SmartLinkRedirectPage'

// Dashboard Layout & Subpages
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardOverviewPage } from '@/pages/dashboard/DashboardOverviewPage'
import { OnboardingPage } from '@/pages/dashboard/OnboardingPage'
import { ProfileSettingsPage } from '@/pages/dashboard/ProfileSettingsPage'
import { MenuManagementPage } from '@/pages/dashboard/MenuManagementPage'
import { QrNfcManagementPage } from '@/pages/dashboard/QrNfcManagementPage'
import { GoogleReviewsPage } from '@/pages/dashboard/GoogleReviewsPage'
import { FeedbackManagementPage } from '@/pages/dashboard/FeedbackManagementPage'
import { WifiManagementPage } from '@/pages/dashboard/WifiManagementPage'
import { OffersManagementPage } from '@/pages/dashboard/OffersManagementPage'
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage'
import { TeamManagementPage } from '@/pages/dashboard/TeamManagementPage'
import { SettingsPage } from '@/pages/dashboard/SettingsPage'

// Super Admin
import { SuperAdminPage } from '@/pages/admin/SuperAdminPage'

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#087BEE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return <>{children}</>
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Customer Facing Profile & Menu */}
          <Route path="/b/:slug" element={<BusinessProfilePage />} />
          <Route path="/b/:slug/menu" element={<DigitalMenuPage />} />

          {/* Smart Link Tracking & Redirect (/go/:code) */}
          <Route path="/go/:code" element={<SmartLinkRedirectPage />} />

          {/* Super Admin Route */}
          <Route path="/admin" element={<SuperAdminPage />} />

          {/* Business Owner Dashboard Nested Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverviewPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="menu" element={<MenuManagementPage />} />
            <Route path="qr-nfc" element={<QrNfcManagementPage />} />
            <Route path="reviews" element={<GoogleReviewsPage />} />
            <Route path="feedback" element={<FeedbackManagementPage />} />
            <Route path="wifi" element={<WifiManagementPage />} />
            <Route path="offers" element={<OffersManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
