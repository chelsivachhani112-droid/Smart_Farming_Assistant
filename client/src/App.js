import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import VoiceAssistant from './components/VoiceAssistant';

// Pages
import UniqueLandingPage from './pages/UniqueLandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CompleteDashboard from './pages/dashboard/CompleteDashboard';
import CropMonitoring from './pages/crops/CropMonitoring';
import WeatherPage from './pages/weather/WeatherPage';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import MarketPrices from './pages/marketplace/MarketPrices';
import ProductDetailsPage from './pages/marketplace/ProductDetailsPage';
import ForumPage from './pages/forum/ForumPage';
import ChatbotPage from './pages/chatbot/ChatbotPage';
import ProfilePage from './pages/profile/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UniqueLandingPage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <CompleteDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crops" 
            element={
              <ProtectedRoute>
                <CropMonitoring />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/weather" 
            element={
              <ProtectedRoute>
                <WeatherPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/market-prices" 
            element={
              <ProtectedRoute>
                <MarketPrices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketplace/product/:id" 
            element={
              <ProtectedRoute>
                <ProductDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <VoiceAssistant />
    </div>
  );
}

export default App;
