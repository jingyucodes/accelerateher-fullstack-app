// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ModulePage from './pages/ModulePage';
import ForumPage from './pages/ForumPage';
import UserProfilePage from './pages/UserProfilePage';
import UserProfileDetailPage from './pages/UserProfileDetailPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route
                path="/dashboard"
                element={<PrivateRoute><DashboardPage /></PrivateRoute>}
              />
              <Route
                path="/modules"
                element={<PrivateRoute><ModulePage /></PrivateRoute>}
              />
              <Route
                path="/forum"
                element={<PrivateRoute><ForumPage /></PrivateRoute>}
              />
              <Route
                path="/forum/thread/:threadId"
                element={<PrivateRoute><ThreadDetailPage /></PrivateRoute>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute><UserProfilePage /></PrivateRoute>}
              />
              <Route
                path="/user-profile/:userId"
                element={<PrivateRoute><UserProfileDetailPage /></PrivateRoute>}
              />

              {/* Fallback route - maybe redirect to dashboard if logged in, or login if not */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;