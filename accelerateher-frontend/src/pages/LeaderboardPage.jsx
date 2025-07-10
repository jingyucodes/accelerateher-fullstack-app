import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { notificationBellRef } from '../components/NotificationBell';

const API_BASE_URL = "http://localhost:8000/api";

const LeaderboardPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { userProfile } = useUserProfile();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overall'); // 'overall', 'modules', 'hours', 'streak'
    const [currentUserRank, setCurrentUserRank] = useState(null);
    const [toast, setToast] = useState(null);

    // Real leaderboard data will be fetched from API

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (userProfile && userProfile.showOnLeaderboard === false) {
            navigate('/dashboard');
            return;
        }

        // 获取真实的排行榜数据
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                console.log('Token exists:', !!token);
                console.log('Token length:', token ? token.length : 0);

                if (!token) {
                    setError('Authentication required - no token found');
                    return;
                }

                console.log('Making leaderboard API request...');
                const response = await fetch(`${API_BASE_URL}/leaderboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Authentication failed, redirecting to login');
                        navigate('/login');
                        return;
                    }
                    const errorText = await response.text();
                    console.error('Leaderboard API error:', errorText);
                    throw new Error(`Failed to fetch leaderboard: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log('Leaderboard data received:', data);
                console.log('Number of users:', data.length);
                setLeaderboardData(data);

                // 找到当前用户的排名
                const currentUser = data.find(user => user.isCurrentUser);
                if (currentUser) {
                    setCurrentUserRank(currentUser.rank);

                    // --- 通知逻辑 ---
                    if (
                        userProfile?.showOnLeaderboard !== false &&
                        userProfile?.notificationsPreference === 'Yes'
                    ) {
                        const lastRank = parseInt(localStorage.getItem('lastLeaderboardRank') || '0', 10);
                        if (currentUser.rank > 0) {
                            if (currentUser.rank <= 3 && lastRank > 3) {
                                setToast('🎉 Congrats! You are now in the Top 3 of the leaderboard!');
                                if (notificationBellRef.push) notificationBellRef.push({
                                    type: 'achievement',
                                    title: 'Leaderboard Achievement',
                                    message: '🎉 Congrats! You are now in the Top 3 of the leaderboard!',
                                    icon: '🏆',
                                });
                            } else if (lastRank > 0 && currentUser.rank < lastRank) {
                                setToast('👏 Jiayou! You are making progress in the leaderboard!');
                                if (notificationBellRef.push) notificationBellRef.push({
                                    type: 'encouragement',
                                    title: 'Leaderboard Progress',
                                    message: '👏 Jiayou! You are making progress in the leaderboard!',
                                    icon: '🚀',
                                });
                            }
                            localStorage.setItem('lastLeaderboardRank', currentUser.rank);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to load leaderboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [isAuthenticated, navigate, userProfile]);

    // Toast自动消失
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const getSortedData = () => {
        let sortedData = [...leaderboardData];
        switch (activeTab) {
            case 'modules':
                sortedData.sort((a, b) => b.completedModules - a.completedModules);
                break;
            case 'hours':
                sortedData.sort((a, b) => b.hoursLearned - a.hoursLearned);
                break;
            case 'streak':
                sortedData.sort((a, b) => b.streak - a.streak);
                break;
            default:
                sortedData.sort((a, b) => b.points - a.points);
        }
        return sortedData.map((user, index) => ({ ...user, rank: index + 1 }));
    };

    const getValueByTab = (user) => {
        switch (activeTab) {
            case 'modules':
                return `${user.completedModules} modules`;
            case 'hours':
                return `${user.hoursLearned}h`;
            case 'streak':
                return `${user.streak} days`;
            default:
                return `${user.points} pts`;
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    if (loading) return (
        <>
            <Header pageTitle="Leaderboard" showDashboardButton={true} />
            <div style={{ padding: "20px" }}>Loading leaderboard...</div>
        </>
    );

    if (error) return (
        <>
            <Header pageTitle="Leaderboard" showDashboardButton={true} />
            <div style={{ padding: "20px", color: 'red' }}>Error: {error}</div>
        </>
    );

    const sortedData = getSortedData();

    return (
        <>
            <Header pageTitle="🏆 Leaderboard" showDashboardButton={true} />
            <div className="leaderboard-container" style={{
                padding: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: '#f8f9fa'
            }}>
                {/* Header Stats */}
                <div className="leaderboard-header" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="stat-card" style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                            {currentUserRank || 'N/A'}
                        </div>
                        <div style={{ color: '#666' }}>Your Rank</div>
                    </div>
                    <div className="stat-card" style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                            {leaderboardData.length}
                        </div>
                        <div style={{ color: '#666' }}>Active Learners</div>
                    </div>
                    <div className="stat-card" style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌟</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                            {leaderboardData.find(user => user.isCurrentUser)?.points || 0}
                        </div>
                        <div style={{ color: '#666' }}>Your Points</div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="leaderboard-tabs" style={{
                    display: 'flex',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    {[
                        { id: 'overall', label: '🏆 Overall Points', icon: '🏆' },
                        { id: 'modules', label: '📚 Modules Completed', icon: '📚' },
                        { id: 'hours', label: '⏰ Learning Hours', icon: '⏰' },
                        { id: 'streak', label: '🔥 Learning Streak', icon: '🔥' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                border: 'none',
                                backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#666',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Leaderboard List */}
                <div className="leaderboard-list" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {sortedData.map((user, index) => (
                        <div
                            key={user.username}
                            className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                borderBottom: index < sortedData.length - 1 ? '1px solid #eee' : 'none',
                                backgroundColor: user.isCurrentUser ? '#fff3cd' : 'transparent',
                                border: user.isCurrentUser ? '2px solid var(--accent)' : 'none',
                                margin: user.isCurrentUser ? '0.25rem' : '0',
                                borderRadius: user.isCurrentUser ? '8px' : '0',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Rank */}
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                width: '60px',
                                textAlign: 'center'
                            }}>
                                {getRankIcon(user.rank)}
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: user.isCurrentUser ? 'var(--accent)' : 'transparent',
                                border: user.isCurrentUser ? 'none' : '2px solid #333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: user.isCurrentUser ? 'white' : '#333',
                                fontWeight: 'bold',
                                marginRight: '1rem'
                            }}>
                                {user.avatar}
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    marginBottom: '0.25rem'
                                }}>
                                    {user.username}
                                    {user.isCurrentUser && (
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            fontSize: '0.8rem',
                                            backgroundColor: 'var(--accent)',
                                            color: 'white',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '12px'
                                        }}>
                                            You
                                        </span>
                                    )}
                                </div>
                                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                    📍 {user.region} • Joined {new Date(user.joinDate).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Score */}
                            <div style={{
                                textAlign: 'right',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: 'var(--accent)'
                            }}>
                                {getValueByTab(user)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    <p>🚀 Keep learning to climb the leaderboard!</p>
                    <p>Rankings update every hour based on your learning activity.</p>
                </div>
            </div>

            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#323232',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: '280px',
                    justifyContent: 'center'
                }}>
                    {toast}
                </div>
            )}
        </>
    );
};

export default LeaderboardPage; 