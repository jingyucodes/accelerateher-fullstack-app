// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LearningAnalytics from '../components/LearningAnalytics';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { userProfile, loading, error, fetchUserProfile } = useUserProfile();
    const { currentUserId } = useAuth();
    const [activePath, setActivePath] = useState(null);
    const [recommendedSkills, setRecommendedSkills] = useState([]);
    const [isNewUser, setIsNewUser] = useState(false);
    const [weeklyHours, setWeeklyHours] = useState(0);
    const [completedHours, setCompletedHours] = useState(0);
    const [weeklyCommitment, setWeeklyCommitment] = useState('');

    // New state for sidebar navigation
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'analytics', or 'forum'

    useEffect(() => {
        if (userProfile && !loading) {
            console.log('User profile loaded:', userProfile);

            // Check if user has an active learning path
            if (userProfile.activeLearningPath && userProfile.activeLearningPath.modules) {
                const completedModules = userProfile.completed_modules || [];
                const updatedPath = { ...userProfile.activeLearningPath };

                // Count completed modules in current path
                const pathModuleIds = updatedPath.modules.map(m => m.id);
                const completedInPath = completedModules.filter(id => pathModuleIds.includes(id)).length;
                const totalModules = updatedPath.modules.length;
                const progressPercentage = totalModules > 0 ? Math.round((completedInPath / totalModules) * 100) : 0;
                updatedPath.progress = `${progressPercentage}% complete`;

                console.log('Updated path progress:', progressPercentage, 'Completed in path:', completedInPath, 'Total modules:', totalModules);

                setActivePath(updatedPath);
                setRecommendedSkills(userProfile.recommendedSkills || []);
                setIsNewUser(false);
            } else {
                // This is a new user or a user who hasn't set up their profile yet
                setIsNewUser(true);
                setActivePath(null); // Explicitly set no active path
            }

            // Weekly Commitment
            if (userProfile.timeCommitment) {
                const hoursMatch = userProfile.timeCommitment.match(/\d+/);
                const hours = hoursMatch ? parseInt(hoursMatch[0]) : 0;
                setWeeklyHours(hours);

                // Use real analytics data if available
                const actualCompletedHours = userProfile.analytics?.current_week?.completed_hours || 0;
                setCompletedHours(actualCompletedHours);

                setWeeklyCommitment(`You planned <strong>${hours}h</strong> this week`);
            } else {
                setWeeklyHours(0);
                setCompletedHours(0);
                setWeeklyCommitment(`Weekly commitment: <strong>Not specified</strong>`);
            }
        } else if (!loading && !userProfile && !error) {
            // No profile, and not loading, and no error yet, means 404 or fresh user
            navigate('/profile'); // Redirect to profile creation if no profile data
        }
    }, [userProfile, loading, error, navigate]);

    if (loading) return <div style={{ padding: "20px" }}>Loading dashboard...</div>;

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <p>Error loading dashboard: {error}</p>
                <button onClick={() => navigate('/profile')}>Go to Profile Setup</button>
            </div>
        );
    }

    if (isNewUser) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Welcome to AccelerateHer!</h2>
                <p>Let's set up your learning profile to get started.</p>
                <button onClick={() => navigate('/profile')}>Complete Profile Setup</button>
            </div>
        );
    }

    const handleContinueLearning = () => {
        if (activePath && activePath.modules) {
            const completedModules = userProfile.completed_modules || [];

            // Find the first incomplete module that's not locked
            const nextModule = activePath.modules.find((module, index) => {
                const isCompleted = completedModules.includes(module.id);
                if (isCompleted) return false;

                // Check if all previous modules are completed (so this one is unlocked)
                const allPreviousCompleted = index === 0 ||
                    activePath.modules.slice(0, index).every(prevModule =>
                        completedModules.includes(prevModule.id)
                    );

                return allPreviousCompleted;
            });

            if (nextModule) {
                navigate(`/module/${nextModule.id}`);
            } else {
                // All modules completed, maybe show a completion message or next course
                alert('Congratulations! You have completed all modules in this course.');
            }
        }
    };

    const renderDashboardContent = () => (
        <>
            {/* Quick Stats Row */}
            <div className="dashboard-stats-row">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <div className="stat-number">
                            {activePath?.modules ?
                                activePath.modules.filter(m => (userProfile.completed_modules || []).includes(m.id)).length
                                : 0
                            }
                        </div>
                        <div className="stat-label">Modules Completed</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <div className="stat-number">{userProfile.timeCommitment?.match(/\d+/)?.[0] || '0'}h</div>
                        <div className="stat-label">Weekly Goal</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <div className="stat-number">{recommendedSkills.length}</div>
                        <div className="stat-label">Skills to Learn</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Active Learning Path */}
                <section className="dashboard-card main-card">
                    <div className="card-header">
                        <h2>🚀 Active Learning Path</h2>
                        <button
                            className="secondary-btn"
                            onClick={() => navigate('/profile')}
                        >
                            Change Path
                        </button>
                    </div>
                    <div className="learning-path-content">
                        <div className="path-title">
                            <h3>{activePath?.title || 'No Active Path'}</h3>
                            <span className="progress-badge">{activePath?.progress || '0% complete'}</span>
                        </div>

                        {activePath?.modules && (
                            <ul className="module-list-new">
                                {activePath.modules.map((module, index) => {
                                    // Get completed modules from user profile
                                    const completedModules = userProfile.completed_modules || [];

                                    // Check completion status
                                    const isCompleted = completedModules.includes(module.id);

                                    // Check if all previous modules are completed
                                    const allPreviousCompleted = index === 0 ||
                                        activePath.modules.slice(0, index).every(prevModule =>
                                            completedModules.includes(prevModule.id)
                                        );

                                    // Module is locked if it's not the first and previous modules aren't completed
                                    const isLocked = !allPreviousCompleted && !isCompleted;

                                    // Module is in progress if it's not completed and not locked
                                    const isInProgress = !isCompleted && !isLocked;

                                    return (
                                        <li
                                            key={module.id}
                                            style={{
                                                padding: '0.75rem',
                                                margin: '0.5rem 0',
                                                backgroundColor: isCompleted ? '#e8f5e8' : isLocked ? '#f5f5f5' : '#fff3cd',
                                                border: '1px solid',
                                                borderColor: isCompleted ? '#c3e6c3' : isLocked ? '#ddd' : '#ffeaa7',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                                opacity: isLocked ? 0.6 : 1
                                            }}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    navigate(`/module/${module.id}`);
                                                }
                                            }}
                                        >
                                            <span style={{
                                                color: isLocked ? '#999' : '#333',
                                                textDecoration: isCompleted ? 'line-through' : 'none'
                                            }}>
                                                {module.title || module.text || `Module ${index + 1}`}
                                            </span>
                                            <span>
                                                {isCompleted ? '✅' : isLocked ? '🔒' : '📖'}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="dashboard-card">
                    <div className="card-header">
                        <h2>🚀 Quick Actions</h2>
                    </div>
                    <div className="quick-actions">
                        <button
                            className="action-btn primary-btn"
                            onClick={handleContinueLearning}
                            style={{
                                backgroundColor: 'var(--accent)',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            <span className="action-icon">📚</span>
                            Continue Learning
                        </button>

                        <button
                            className="action-btn"
                            onClick={() => navigate('/forum')}
                        >
                            <span className="action-icon">💬</span>
                            Visit Forum
                        </button>

                        <button
                            className="action-btn"
                            onClick={() => alert('Schedule Learning Time feature coming soon!')}
                        >
                            <span className="action-icon">📅</span>
                            Schedule Learning Time
                        </button>
                    </div>
                </section>
            </div>
        </>
    );

    const renderAnalyticsContent = () => (
        <div className="analytics-full-page">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
                <h2>📊 Learning Analytics</h2>
                <button
                    className="secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem('authToken');
                            const response = await fetch('http://localhost:8000/api/analytics/refresh', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (response.ok) {
                                const result = await response.json();
                                console.log('Analytics refreshed:', result);
                                fetchUserProfile(currentUserId);
                            } else {
                                console.error('Failed to refresh analytics');
                            }
                        } catch (err) {
                            console.error('Error refreshing analytics:', err);
                        }
                    }}
                >
                    Refresh
                </button>
            </div>
            <LearningAnalytics />
        </div>
    );

    const renderForumContent = () => (
        <div className="forum-full-page">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
                <h2>💬 Forum Discussion</h2>
                <button
                    className="primary-btn"
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={() => navigate('/forum')}
                >
                    Go to Full Forum
                </button>
            </div>
            <div className="forum-preview">
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    Forum discussions and community interactions will be displayed here.
                    <br /><br />
                    Click "Go to Full Forum" to access the complete forum experience.
                </p>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeView) {
            case 'analytics':
                return renderAnalyticsContent();
            case 'forum':
                return renderForumContent();
            default:
                return renderDashboardContent();
        }
    };

    return (
        <>
            <Header pageTitle={`Welcome back, ${userProfile.userName || 'Learner'}!`} />
            <div className="canvas-layout">
                {/* Sidebar Navigation */}
                <div className="canvas-sidebar">
                    <div className="sidebar-menu">
                        <button
                            className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveView('dashboard')}
                        >
                            <span className="sidebar-icon">🏠</span>
                            Dashboard
                        </button>
                        <button
                            className={`sidebar-item ${activeView === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveView('analytics')}
                        >
                            <span className="sidebar-icon">📊</span>
                            Learning Analytics
                        </button>
                        <button
                            className={`sidebar-item ${activeView === 'forum' ? 'active' : ''}`}
                            onClick={() => setActiveView('forum')}
                        >
                            <span className="sidebar-icon">💬</span>
                            Forum
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="canvas-main">
                    <div className="dashboard-new-container">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;