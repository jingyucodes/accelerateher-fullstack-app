import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';

const Header = ({ pageTitle, showDashboardButton = false, showLogoutButton = true }) => {
    const navigate = useNavigate();
    const { userProfile, logoutUser } = useUserProfile();

    const handleLogout = () => {
        logoutUser();
        navigate('/profile'); // Or to a dedicated login page
    };
    
    let titleToDisplay = pageTitle;
    if (pageTitle && pageTitle.includes("Welcome back") && userProfile) {
        titleToDisplay = `Welcome back, ${userProfile.name || 'Learner'}!`;
    } else if (pageTitle && pageTitle.includes("Welcome back")) {
         titleToDisplay = `Welcome back, Learner!`;
    }


    return (
        <header className="app-header">
            <h1>{titleToDisplay}</h1>
            <div className="nav-buttons">
                {showDashboardButton && (
                    <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                )}
                {showLogoutButton && (
                    <button onClick={handleLogout}>Log Out</button>
                )}
            </div>
        </header>
    );
};

export default Header;