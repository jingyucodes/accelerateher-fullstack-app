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

// Updated ProtectedRoute to use authentication and profile completeness
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, error } = useUserProfile();

  if (authLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = window.location.pathname;

  // If no profile at all, redirect to profile creation
  if (!userProfile && !error && !profileLoading && currentPath !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  // If profile exists but is incomplete, redirect to profile completion
  // (except if already on profile page)
  if (userProfile && currentPath !== '/profile') {
    const hasCompletedProfile = !!(userProfile.activeLearningPath &&
      userProfile.futureSkills &&
      userProfile.timeCommitment);

    console.log('ProtectedRoute: Profile completeness check:', {
      hasActiveLearningPath: !!userProfile.activeLearningPath,
      hasFutureSkills: !!userProfile.futureSkills,
      hasTimeCommitment: !!userProfile.timeCommitment,
      hasCompletedProfile
    });

    if (!hasCompletedProfile) {
      console.log('ProtectedRoute: Profile incomplete, redirecting to /profile');
      return <Navigate to="/profile" replace />;
    }
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