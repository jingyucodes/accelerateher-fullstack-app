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
    
    // Local state for dashboard specific dynamic content based on profile
    const [activePath, setActivePath] = React.useState({ title: '', modules: [], progress: '' });
    const [recommendedSkills, setRecommendedSkills] = React.useState([]);
    const [weeklyCommitment, setWeeklyCommitment] = React.useState('');

    useEffect(() => {
        // If profile isn't loaded yet (e.g., direct navigation to dashboard), try fetching
        if (!userProfile && !loading && currentUserId) {
            fetchUserProfile(currentUserId);
        }
    }, [userProfile, loading, fetchUserProfile, currentUserId]);

    useEffect(() => {
        if (userProfile) {
            // Logic to determine active path, recommended skills, weekly commitment
            const goals = userProfile.futureSkills ? userProfile.futureSkills.toLowerCase() : "";
            let currentPath = { title: 'Python for Data Analysis', progress: '40% complete', modules: [
                { id: 'python_fundamentals', text: 'Module 1: Python Fundamentals', completed: true },
                { id: 'numpy_essentials', text: 'Module 2: NumPy Essentials', completed: true },
                { id: 'pandas_core', text: 'Module 3: Pandas Core', inProgress: true },
                { id: 'data_visualization', text: 'Module 4: Data Visualization', locked: true },
            ]};
            let recSkills = [];
            let recommendationsMade = false;

            if (goals.includes("cloud") || goals.includes("azure") || goals.includes("aws")) {
                currentPath = { title: 'Cloud Computing Foundations', progress: 'New Path!', modules: [
                    { id: 'cloud_intro', text: 'Module 1: Intro to Cloud Concepts', completed: true },
                    { id: 'aws_basics', text: 'Module 2: AWS Core Services', inProgress: true },
                    { id: 'azure_basics', text: 'Module 3: Azure Fundamentals', locked: true },
                ]};
                recSkills.push('DevOps Principles');
                recommendationsMade = true;
                if (goals.includes("security")) {
                    recSkills.push('Cloud Security Best Practices');
                }
            } else if (goals.includes("python")) {
                 currentPath = { title: 'Python Programming Path', progress: 'New Path!', modules: [
                    { id: 'python_fundamentals', text: 'Module 1: Python Basics', completed: true },
                    { id: 'python_data_structures', text: 'Module 2: Data Structures in Python', inProgress: true },
                    { id: 'python_oop', text: 'Module 3: Object-Oriented Python', locked: true },
                 ]};
                if (goals.includes("data")) {
                    recSkills.push('NumPy & Pandas', 'Data Visualization');
                    recommendationsMade = true;
                } else {
                    recSkills.push('Web Scraping with Python');
                    recommendationsMade = true;
                }
            } else if (goals.includes("web develop") || goals.includes("full-stack")) {
                 currentPath = { title: 'Web Development Track', progress: 'New Path!', modules: [
                    { id: 'html_css_js', text: 'Module 1: HTML, CSS, JavaScript', completed: true },
                    { id: 'react_basics', text: 'Module 2: React Fundamentals', inProgress: true },
                    { id: 'nodejs_express', text: 'Module 3: Backend with Node.js', locked: true },
                 ]};
                 recSkills.push('Responsive Design', 'API Design');
                 recommendationsMade = true;
            }
            
            if (!recommendationsMade || recSkills.length === 0) {
                recSkills.push('Git & Version Control', 'Agile Methodologies');
            }
            setActivePath(currentPath);
            setRecommendedSkills(recSkills);

            // Weekly Commitment
            if (userProfile.timeCommitment) {
                const hoursMatch = userProfile.timeCommitment.match(/\d+/);
                const hours = hoursMatch ? hoursMatch[0] : userProfile.timeCommitment;
                setWeeklyCommitment(`You planned <strong>${hours}h</strong> this week; (progress TBD)`);
            } else {
                setWeeklyCommitment(`Weekly commitment: <strong>Not specified</strong>`);
            }

        } else if (!loading && !userProfile && !error) {
            // No profile, and not loading, and no error yet, means 404 or fresh user
             navigate('/profile'); // Redirect to profile creation if no profile data
        }
    }, [userProfile, loading, error, navigate]);

    if (loading) return <div style={{padding: "20px"}}>Loading dashboard...</div>;
    if (error) return <div style={{padding: "20px"}}>Error: {error}. Please try <button onClick={() => fetchUserProfile(currentUserId)}>refreshing</button> or go to <Link to="/profile">profile setup</Link>.</div>;
    if (!userProfile) return <div style={{padding: "20px"}}>No profile data. Redirecting to profile setup...</div>;

    return (
        <>
            <Header pageTitle={`Welcome back, ${userProfile.name || 'Learner'}!`} />
            <div className="dashboard-new-container">
                {/* Quick Stats Row */}
                <div className="dashboard-stats-row">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <div className="stat-number">{activePath.modules.filter(m => m.completed).length}</div>
                            <div className="stat-label">Modules Completed</div>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-content">
                            <div className="stat-number">{activePath.progress}</div>
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
                                <h3>{activePath.title}</h3>
                                <span className="progress-badge">{activePath.progress}</span>
                            </div>
                            <ul className="module-list-new">
                                {activePath.modules.map(module => (
                                    <ModuleListItem 
                                        key={module.id} 
                                        href={`/module/${module.id}`} 
                                        text={module.text} 
                                        locked={module.locked}
                                        inProgress={module.inProgress}
                                        completed={module.completed}
                                    />
                                ))}
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
                                <div className="progress-fill" style={{width: '30%'}}></div>
                            </div>
                            <p className="progress-text">3 of 10 hours completed this week</p>
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