// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import UserProfileDetailPage from './pages/UserProfileDetailPage';
import ForumPage from './pages/ForumPage';
import ModulePage from './pages/ModulePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './index.css';

// Updated ProtectedRoute to use authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, error } = useUserProfile();

  if (authLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Don't redirect to profile if we're already on the profile page
  // or if there's an error - let the page handle it
  const currentPath = window.location.pathname;
  if (!userProfile && !error && currentPath !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-details"
              element={
                <ProtectedRoute>
                  <UserProfileDetailPage />
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
              path="/module/:moduleId"
              element={
                <ProtectedRoute>
                  <ModulePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;