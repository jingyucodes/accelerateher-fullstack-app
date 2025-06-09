// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import Header from '../components/Header';

const ModuleListItem = ({ href, text, locked = false, inProgress = false, completed = false }) => {
    let statusText = '';
    if (inProgress) statusText = ' (in progress)';
    if (completed) statusText = ' ✅';
    if (locked) statusText = ' (locked)';

    return (
        <li className={locked ? 'locked' : ''}>
            <Link to={href}>{text}{statusText}</Link>
        </li>
    );
};

const DashboardPage = () => {
    const { userProfile, loading, error, fetchUserProfile, currentUserId } = useUserProfile();
    const navigate = useNavigate();

    const [activePath, setActivePath] = React.useState(null);
    const [recommendedSkills, setRecommendedSkills] = React.useState([]);
    const [weeklyCommitment, setWeeklyCommitment] = React.useState('');
    const [isNewUser, setIsNewUser] = React.useState(false);
    const [weeklyHours, setWeeklyHours] = React.useState(0);
    const [completedHours, setCompletedHours] = React.useState(0);

    useEffect(() => {
        // If profile isn't loaded yet (e.g., direct navigation to dashboard), try fetching
        if (!userProfile && !loading && currentUserId) {
            fetchUserProfile(currentUserId);
        }
    }, [userProfile, loading, fetchUserProfile, currentUserId]);

    useEffect(() => {
        if (userProfile) {
            // New logic: Check if a learning path is defined in the profile
            if (userProfile.activeLearningPath) {
                setActivePath(userProfile.activeLearningPath);
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

                // For now, we'll simulate some progress (in a real app, this would come from user activity data)
                const simulatedCompletedHours = Math.floor(hours * 0.3); // 30% progress as example
                setCompletedHours(simulatedCompletedHours);

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
    if (error) return <div style={{ padding: "20px" }}>Error: {error}. Please try <button onClick={() => fetchUserProfile(currentUserId)}>refreshing</button> or go to <Link to="/profile">profile setup</Link>.</div>;
    if (!userProfile) return <div style={{ padding: "20px" }}>No profile data. Redirecting to profile setup...</div>;

    // New User Welcome Screen
    if (isNewUser) {
        return (
            <>
                <Header pageTitle={`Welcome, ${userProfile.name || 'Learner'}!`} />
                <div className="dashboard-new-container" style={{ textAlign: 'center' }}>
                    <section className="dashboard-card" style={{ padding: '40px' }}>
                        <h2>Let's Get Your Learning Journey Started!</h2>
                        <p style={{ maxWidth: '600px', margin: '20px auto' }}>
                            Your dashboard is ready. The first step is to tell us about your learning goals so we can build a personalized path for you.
                        </p>
                        <button
                            className="primary-btn"
                            style={{ fontSize: '1.2rem', padding: '15px 30px' }}
                            onClick={() => navigate('/profile')}
                        >
                            Set Up Your Profile
                        </button>
                    </section>
                </div>
            </>
        );
    }

    return (
        <>
            <Header pageTitle={`Welcome back, ${userProfile.name || 'Learner'}!`} />
            <div className="dashboard-new-container">
                {/* Quick Stats Row */}
                <div className="dashboard-stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <div className="stat-number">{activePath?.modules?.filter(m => m.completed).length || 0}</div>
                            <div className="stat-label">Modules Completed</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <div className="stat-number">{activePath?.progress || 'N/A'}</div>
                            <div className="stat-label">Current Progress</div>
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
                    {/* Active Learning Path - Takes up more space */}
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
                                <h3>{activePath?.title || "No Path Selected"}</h3>
                                <span className="progress-badge">{activePath?.progress || "0%"}</span>
                            </div>
                            <ul className="module-list-new">
                                {activePath?.modules?.map(module => (
                                    <ModuleListItem
                                        key={module.id}
                                        href={`/module/${module.id}`}
                                        text={module.text}
                                        locked={module.locked}
                                        inProgress={module.inProgress}
                                        completed={module.completed}
                                    />
                                )) || <li>No modules in the current path.</li>}
                            </ul>
                        </div>
                    </section>

                    {/* Weekly Commitment */}
                    <section className="dashboard-card">
                        <div className="card-header">
                            <h2>📅 This Week</h2>
                        </div>
                        <div className="weekly-content">
                            <p dangerouslySetInnerHTML={{ __html: weeklyCommitment }} />
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: weeklyHours > 0 ? `${(completedHours / weeklyHours) * 100}%` : '0%'
                                    }}
                                ></div>
                            </div>
                            <p className="progress-text">
                                {completedHours} of {weeklyHours} hours completed this week
                            </p>
                            <button
                                className="primary-btn"
                                onClick={() => alert('Scheduling UI TBD')}
                            >
                                Schedule Learning Time
                            </button>
                        </div>
                    </section>

                    {/* Recommended Skills */}
                    <section className="dashboard-card">
                        <div className="card-header">
                            <h2>💡 Recommended Skills</h2>
                        </div>
                        <div className="skills-content">
                            <p>Based on your learning goals:</p>
                            <div className="skills-grid">
                                {recommendedSkills.length > 0
                                    ? recommendedSkills.map(skill => (
                                        <div key={skill} className="skill-badge">{skill}</div>
                                    ))
                                    : <div className="skill-badge">Explore based on your goals!</div>
                                }
                            </div>
                            <button
                                className="secondary-btn"
                                onClick={() => navigate('/profile-details')}
                            >
                                View Full Profile
                            </button>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="dashboard-card">
                        <div className="card-header">
                            <h2>⚡ Quick Actions</h2>
                        </div>
                        <div className="quick-actions">
                            <button
                                className="action-btn"
                                onClick={() => navigate('/forum')}
                            >
                                <span className="action-icon">💬</span>
                                Community Forum
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => navigate('/profile')}
                            >
                                <span className="action-icon">✏️</span>
                                Update Goals
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => alert('Achievements coming soon!')}
                            >
                                <span className="action-icon">🏅</span>
                                View Achievements
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;