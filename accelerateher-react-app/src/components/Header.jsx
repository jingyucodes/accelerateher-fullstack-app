import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ pageTitle, showDashboardButton = false, showLogoutButton = true }) => {
    const navigate = useNavigate();
    const { userProfile } = useUserProfile();
    const { logout } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let titleToDisplay = pageTitle;
    if (pageTitle && pageTitle.includes("Welcome back") && userProfile && userProfile.name && userProfile.name !== 'Learner') {
        titleToDisplay = `Welcome back, ${userProfile.name}!`;
    } else if (pageTitle && pageTitle.includes("Welcome back")) {
        titleToDisplay = `Welcome back, Learner!`;
    }

    const getInitials = (name) => {
        if (!name || name === 'Learner') return 'L';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <h1>{titleToDisplay}</h1>
            </div>

            <div className="header-right">
                <div className="nav-buttons">
                    {showDashboardButton && (
                        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                    )}
                </div>

                {/* User Profile Dropdown */}
                <div className="user-profile-dropdown">
                    <button
                        className="profile-avatar-btn"
                        onClick={toggleProfileDropdown}
                        aria-label="User menu"
                    >
                        <div className="avatar-circle">
                            {getInitials(userProfile?.name)}
                        </div>
                        <span className="dropdown-arrow">▼</span>
                    </button>

                    {showProfileDropdown && (
                        <div className="profile-dropdown-menu">
                            <div className="profile-dropdown-header">
                                <div className="avatar-circle large">
                                    {getInitials(userProfile?.name)}
                                </div>
                                <div className="profile-info">
                                    <div className="profile-name">{userProfile?.name || 'Learner'}</div>
                                    <div className="profile-goal">{userProfile?.futureSkills || 'Learning in progress'}</div>
                                </div>
                            </div>

                            <div className="profile-dropdown-divider"></div>

                            <div className="profile-dropdown-actions">
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate('/profile-details');
                                        setShowProfileDropdown(false);
                                    }}
                                >
                                    <span className="dropdown-icon">👤</span>
                                    View Profile
                                </button>

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowProfileDropdown(false);
                                    }}
                                >
                                    <span className="dropdown-icon">✏️</span>
                                    Edit Profile
                                </button>

                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate('/dashboard');
                                        setShowProfileDropdown(false);
                                    }}
                                >
                                    <span className="dropdown-icon">📊</span>
                                    Dashboard
                                </button>

                                <div className="profile-dropdown-divider"></div>

                                {showLogoutButton && (
                                    <button
                                        className="dropdown-item logout"
                                        onClick={() => {
                                            handleLogout();
                                            setShowProfileDropdown(false);
                                        }}
                                    >
                                        <span className="dropdown-icon">🚪</span>
                                        Log Out
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdown when clicking outside */}
            {showProfileDropdown && (
                <div
                    className="dropdown-overlay"
                    onClick={() => setShowProfileDropdown(false)}
                ></div>
            )}
        </header>
    );
};

export default Header;