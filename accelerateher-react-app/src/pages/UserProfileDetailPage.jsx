import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import Header from '../components/Header';

const UserProfileDetailPage = () => {
    const { userProfile, saveUserProfile, loading, error, currentUserId } = useUserProfile();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (userProfile) {
            setEditedProfile({ ...userProfile });
        }
    }, [userProfile]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile({ ...userProfile });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile({ ...userProfile });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveUserProfile({
                ...editedProfile,
                user_id: currentUserId
            });
            if (result) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getInitials = (name) => {
        if (!name || name === 'Learner') return 'L';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) return <div className="loading-container">Loading profile...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;
    if (!userProfile) return <div className="error-container">No profile found.</div>;

    return (
        <>
            <Header pageTitle="Profile Details" showDashboardButton={true} />
            <div className="profile-detail-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {getInitials(userProfile.name)}
                    </div>
                    <div className="profile-header-info">
                        <h1>{userProfile.name || 'Learner'}</h1>
                        <p className="profile-subtitle">{userProfile.futureSkills || 'Learning in progress'}</p>
                        <div className="profile-header-actions">
                            {!isEditing ? (
                                <>
                                    <button className="primary-btn" onClick={handleEdit}>
                                        ✏️ Edit Profile
                                    </button>
                                    <button
                                        className="secondary-btn"
                                        onClick={() => navigate('/profile')}
                                    >
                                        🔄 Update Learning Path
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="primary-btn"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : '💾 Save Changes'}
                                    </button>
                                    <button
                                        className="secondary-btn"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        ❌ Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="profile-content">
                    <div className="profile-section">
                        <h2>📋 Personal Information</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label>Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.name || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>Notification Preferences</label>
                                {isEditing ? (
                                    <select
                                        value={editedProfile.notificationsPreference || ''}
                                        onChange={(e) => handleInputChange('notificationsPreference', e.target.value)}
                                    >
                                        <option value="">Select preference</option>
                                        <option value="yes">Yes, send me notifications</option>
                                        <option value="no">No notifications</option>
                                    </select>
                                ) : (
                                    <div className="field-value">{userProfile.notificationsPreference || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>🎯 Learning Goals</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label>Future Skills & Goals</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.futureSkills || ''}
                                        onChange={(e) => handleInputChange('futureSkills', e.target.value)}
                                        placeholder="What skills do you want to learn?"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.futureSkills || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>Current Skills & Experience</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.currentSkills || ''}
                                        onChange={(e) => handleInputChange('currentSkills', e.target.value)}
                                        placeholder="Describe your current technical background"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.currentSkills || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>End Goal & Motivation</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.endGoalMotivation || ''}
                                        onChange={(e) => handleInputChange('endGoalMotivation', e.target.value)}
                                        placeholder="What's your ultimate goal with this learning?"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.endGoalMotivation || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>📚 Learning Preferences</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label>Preferred Learning Style</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.preferredLearningStyle || ''}
                                        onChange={(e) => handleInputChange('preferredLearningStyle', e.target.value)}
                                        placeholder="How do you prefer to learn? (videos, hands-on, reading, etc.)"
                                        rows="2"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.preferredLearningStyle || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>Learning Activity Preferences</label>
                                {isEditing ? (
                                    <textarea
                                        value={editedProfile.learningPreferences || ''}
                                        onChange={(e) => handleInputChange('learningPreferences', e.target.value)}
                                        placeholder="What types of activities engage you most?"
                                        rows="2"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.learningPreferences || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>Time Commitment</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.timeCommitment || ''}
                                        onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                                        placeholder="How many hours per week can you dedicate?"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile.timeCommitment || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="profile-section">
                        <h2>⚡ Quick Actions</h2>
                        <div className="quick-actions-grid">
                            <button
                                className="action-card"
                                onClick={() => navigate('/dashboard')}
                            >
                                <span className="action-icon">📊</span>
                                <span className="action-text">Back to Dashboard</span>
                            </button>

                            <button
                                className="action-card"
                                onClick={() => navigate('/profile')}
                            >
                                <span className="action-icon">🔄</span>
                                <span className="action-text">Update Learning Path</span>
                            </button>

                            <button
                                className="action-card"
                                onClick={() => navigate('/forum')}
                            >
                                <span className="action-icon">💬</span>
                                <span className="action-text">Community Forum</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfileDetailPage; 