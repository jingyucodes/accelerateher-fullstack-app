// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react'; // Removed useState if not directly used for local state
import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import Header from '../components/Header'; // Assuming Header component exists

// ProfileDetailItem and ModuleListItem components can be moved to their own files or kept here
const ProfileDetailItem = ({ label, value }) => ( /* ... same ... */
    <p>
        <span className="label">{label}:</span> <strong>{value || 'Not specified'}</strong>
    </p>
);

const ModuleListItem = ({ href, text, locked = false, inProgress = false, completed = false }) => { /* ... same ... */
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
    const { userProfile, loading, error, fetchUserProfile, currentUserId } = useUserProfile(); // Get fetch function and userId
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
            // This is the same logic as before, just ensure userProfile is not null
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
    if (!userProfile) return <div style={{padding: "20px"}}>No profile data. Redirecting to profile setup...</div>; // Should be redirected by useEffect

    return (
        <>
            <Header pageTitle={`Welcome back, ${userProfile.name || 'Learner'}!`} />
            <div className="dashboard-container">
                <aside className="dashboard-sidebar">
                    <h2>Your Profile</h2>
                    <div className="profile-details">
                        <ProfileDetailItem label="Name" value={userProfile.name} />
                        <ProfileDetailItem label="Future Goals" value={userProfile.futureSkills} />
                        <ProfileDetailItem label="Current Skills" value={userProfile.currentSkills} />
                        <ProfileDetailItem label="Preferred Learning Style" value={userProfile.preferredLearningStyle} />
                        <ProfileDetailItem label="Learning Preferences" value={userProfile.learningPreferences} />
                        <ProfileDetailItem label="End Goal & Motivation" value={userProfile.endGoalMotivation} />
                        <ProfileDetailItem label="Notifications" value={userProfile.notificationsPreference} />
                    </div>
                    <button onClick={() => navigate('/profile')}>Edit Profile & Goals</button>
                    <Link to="/forum" className="sidebar-link-btn">Community Forum</Link>
                </aside>

                <main className="dashboard-main">
                    <section className="dashboard-section">
                        <h2>Active Learning Path</h2>
                        <p>
                            <strong>{activePath.title}</strong> <span className="badge">{activePath.progress}</span>
                        </p>
                        <ul className="module-list">
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
                    </section>

                    <section className="dashboard-section">
                        <h2>Weekly Commitment</h2>
                        <p dangerouslySetInnerHTML={{ __html: weeklyCommitment }} />
                        {/* Ensure weeklyCommitment is sanitized if it could ever contain user input */}
                        <button className="schedule-btn" onClick={() => alert('Scheduling UI TBD')}>Schedule Now</button>
                    </section>
                    
                    <section className="dashboard-section">
                        <h2>Recommended Next Skills</h2>
                        <div>
                            {recommendedSkills.length > 0 
                                ? recommendedSkills.map(skill => <p key={skill} className="badge">{skill}</p>)
                                : <p className="badge">Explore based on your goals!</p>
                            }
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default DashboardPage;