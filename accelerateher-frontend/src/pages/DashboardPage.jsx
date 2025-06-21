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

            // Check if user has completed their profile setup
            const hasCompletedProfile = !!(userProfile.activeLearningPath &&
                userProfile.futureSkills &&
                userProfile.timeCommitment);

            console.log('Profile completeness check:', {
                hasActiveLearningPath: !!userProfile.activeLearningPath,
                hasFutureSkills: !!userProfile.futureSkills,
                hasTimeCommitment: !!userProfile.timeCommitment,
                hasCompletedProfile
            });

            if (hasCompletedProfile) {
                const completedModules = userProfile.completed_modules || [];
                const updatedPath = { ...userProfile.activeLearningPath };

                // Use modules from userProfile.modules or activeLearningPath.modules as fallback
                const modules = userProfile.modules || userProfile.activeLearningPath?.modules || [];

                if (modules.length > 0) {
                    // Count completed modules in current path
                    const pathModuleIds = modules.map(m => m.id);
                    const completedInPath = completedModules.filter(id => pathModuleIds.includes(id)).length;
                    const totalModules = modules.length;
                    const progressPercentage = totalModules > 0 ? Math.round((completedInPath / totalModules) * 100) : 0;
                    updatedPath.progress = `${progressPercentage}% complete`;
                    updatedPath.modules = modules; // Ensure modules are in the path

                    console.log('Updated path progress:', progressPercentage, 'Completed in path:', completedInPath, 'Total modules:', totalModules);
                } else {
                    // No modules yet, show 0% progress
                    updatedPath.progress = '0% complete';
                    updatedPath.modules = [];
                    console.log('No modules found, setting 0% progress');
                }

                setActivePath(updatedPath);
                setRecommendedSkills(userProfile.recommendedSkills || []);
                setIsNewUser(false);
            } else {
                // User needs to complete their profile setup
                console.log('User profile incomplete, showing welcome screen');
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
            <>
                <Header pageTitle={`Welcome to AccelerateHer!`} />
                <div className="canvas-layout">
                    <div className="canvas-main">
                        <div className="dashboard-new-container">
                            {/* Welcome Header */}
                            <div className="dashboard-card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{ padding: '3rem 2rem' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                                    <h1 style={{
                                        color: 'var(--accent)',
                                        marginBottom: '1rem',
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold'
                                    }}>
                                        Welcome to AccelerateHer!
                                    </h1>
                                    <p style={{
                                        fontSize: '1.2rem',
                                        color: '#666',
                                        marginBottom: '2rem',
                                        lineHeight: 1.6
                                    }}>
                                        Let's create your personalized learning profile to unlock your potential in tech
                                    </p>
                                    <button
                                        className="primary-btn"
                                        onClick={() => navigate('/profile')}
                                        style={{
                                            fontSize: '1.1rem',
                                            padding: '1rem 2.5rem',
                                            background: 'linear-gradient(135deg, var(--accent), #1976D2)',
                                            border: 'none',
                                            color: 'white',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.3)';
                                        }}
                                    >
                                        🎯 Complete Profile Setup
                                    </button>
                                </div>
                            </div>

                            {/* Feature Preview Cards */}
                            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                                <div className="dashboard-card">
                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                                        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AI-Powered Learning</h3>
                                        <p style={{ color: '#666', lineHeight: 1.5 }}>
                                            Get personalized learning paths based on your goals and preferences through our AI chatbot
                                        </p>
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Progress Tracking</h3>
                                        <p style={{ color: '#666', lineHeight: 1.5 }}>
                                            Monitor your learning journey with detailed analytics and achievement tracking
                                        </p>
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                                        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Community Support</h3>
                                        <p style={{ color: '#666', lineHeight: 1.5 }}>
                                            Connect with other learners and get support from our vibrant tech community
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="dashboard-card" style={{ marginTop: '2rem' }}>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{ color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                        🌟 What happens next?
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <span style={{ fontSize: '2rem', marginRight: '1rem' }}>1️⃣</span>
                                            <div>
                                                <strong>Chat with our AI</strong>
                                                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                                    Tell us about your goals and learning preferences
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <span style={{ fontSize: '2rem', marginRight: '1rem' }}>2️⃣</span>
                                            <div>
                                                <strong>Get your learning path</strong>
                                                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                                    Receive a personalized curriculum tailored to you
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <span style={{ fontSize: '2rem', marginRight: '1rem' }}>3️⃣</span>
                                            <div>
                                                <strong>Start learning!</strong>
                                                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                                    Begin your journey with interactive modules
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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
                    </div>
                    <div className="learning-path-content">
                        <div className="path-title">
                            <h3>{activePath?.title || 'No Active Path'}</h3>
                            <span className="progress-badge" style={{
                                background: activePath?.progress === '100% complete' ?
                                    'linear-gradient(135deg, #4CAF50, #45a049)' :
                                    'linear-gradient(135deg, #2196F3, #1976D2)',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                {activePath?.progress === '100% complete' ? '🎉 ' : ''}
                                {activePath?.progress || '0% complete'}
                            </span>
                        </div>

                        {activePath?.progress === '100% complete' && (
                            <div style={{
                                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '8px',
                                textAlign: 'center',
                                margin: '1rem 0',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                            }}>
                                🎉 Congratulations! You've completed this learning path! 🎉
                            </div>
                        )}

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
                                                padding: '1rem',
                                                margin: '0.75rem 0',
                                                backgroundColor: isCompleted ? '#f0f9ff' : isLocked ? '#f5f5f5' : '#fff3cd',
                                                border: '2px solid',
                                                borderColor: isCompleted ? '#4CAF50' : isLocked ? '#ddd' : '#ffeaa7',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                                opacity: isLocked ? 0.6 : 1,
                                                transition: 'all 0.2s ease',
                                                boxShadow: isCompleted ? '0 4px 12px rgba(76, 175, 80, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
                                            }}
                                            onClick={() => {
                                                if (!isLocked) {
                                                    navigate(`/module/${module.id}`);
                                                }
                                            }}
                                        >
                                            <span style={{
                                                color: isCompleted ? '#4CAF50' : isLocked ? '#999' : '#333',
                                                fontWeight: isCompleted ? '600' : '500',
                                                textDecoration: 'none'
                                            }}>
                                                {module.title || module.text || `Module ${index + 1}`}
                                            </span>
                                            <span style={{ fontSize: '1.2rem' }}>
                                                {isCompleted ? '✅' : isLocked ? '🔒' : '📖'}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>

                {/* Quick Actions - DISABLED */}
                {/* 
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
                */}
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
            <Header pageTitle={`Welcome back, ${userProfile.userName || userProfile.user_id || 'Learner'}!`} />
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