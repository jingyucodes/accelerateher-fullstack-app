// src/App.jsx
import React, { useContext } from 'react'; // Add useContext
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext'; // Import useUserProfile
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import ForumPage from './pages/ForumPage';
import ModulePage from './pages/ModulePage';
import './index.css';

// Updated ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { userProfile, loading, error } = useUserProfile(); // Use context state

  if (loading) {
    return <div>Loading user session...</div>; // Or a spinner component
  }

  if (error && !userProfile) { // If there was an error loading and no profile
    // console.warn("Protected route error, redirecting to profile:", error);
    // This might happen if the backend is down during initial load.
    // Decide if you want to allow access to /profile or a dedicated error page.
    // For now, let's allow /profile so they can try to create one if it's a 404 from backend.
    // If error is something else, it's a problem.
    // A simple check: if error is just "Failed to fetch profile" (404), allow /profile
    if (typeof error === 'string' && error.toLowerCase().includes("not found")) {
        // This is a bit weak, better to check error code from backend if possible
        return <Navigate to="/profile" replace />;
    }
    // For other errors, maybe an error page or still /profile
    // return <div>An error occurred: {typeof error === 'string' ? error : "Unknown error"}. Please try again later.</div>;
    // Or, still redirect to profile for simplicity in this demo:
    return <Navigate to="/profile" replace />;
  }

  if (!userProfile) { // No profile and not loading and no specific "not found" error
    return <Navigate to="/profile" replace />;
  }

  return children;
};


function App() {
  return (
    <UserProfileProvider>
      <Router>
        <Routes>
          {/* Default route can be dashboard, ProtectedRoute will handle redirection */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile" element={<UserProfilePage />} /> {/* Profile page is public for creation/editing */}
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
          <Route path="*" element={<div>Page Not Found - <Link to="/">Go Home</Link></div>} />
        </Routes>
      </Router>
    </UserProfileProvider>
  );
}

export default App;