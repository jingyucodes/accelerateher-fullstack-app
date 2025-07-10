import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const UserProfileDetailPage = () => {
    const { userProfile, saveUserProfile, loading, error, currentUserId } = useUserProfile();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setEditedProfile({
                ...userProfile,
                userName: userProfile.userName || (user ? user.user_id : ''),
            });
        } else if (user && !loading) {
            setEditedProfile({
                userName: user.user_id || '',
                futureSkills: '',
                currentSkills: '',
                preferredLearningStyle: '',
                timeCommitment: '',
                learningPreferences: '',
                endGoalMotivation: '',
                notificationsPreference: '',
            });
        }
    }, [userProfile, user, loading]);

    const handleEdit = () => {
        setIsEditing(true);
        if (userProfile) {
            setEditedProfile({
                ...userProfile,
                userName: userProfile.userName || (user ? user.user_id : ''),
            });
        } else if (user) {
            setEditedProfile({
                userName: user.user_id || '',
                futureSkills: '',
                currentSkills: '',
                preferredLearningStyle: '',
                timeCommitment: '',
                learningPreferences: '',
                endGoalMotivation: '',
                notificationsPreference: '',
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (userProfile) {
            setEditedProfile({
                ...userProfile,
                userName: userProfile.userName || (user ? user.user_id : ''),
            });
        } else if (user) {
            setEditedProfile({
                userName: user.user_id || '',
                futureSkills: '',
                currentSkills: '',
                preferredLearningStyle: '',
                timeCommitment: '',
                learningPreferences: '',
                endGoalMotivation: '',
                notificationsPreference: '',
            });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { user_id, ...payloadToSave } = editedProfile;

            const result = await saveUserProfile(payloadToSave);
            if (result) {
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
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

    const getInitials = () => {
        const nameForInitials = editedProfile.userName || userProfile?.userName || (user ? user.user_id : 'L');
        if (!nameForInitials) return user && user.user_id ? user.user_id.charAt(0).toUpperCase() : 'L';
        return nameForInitials.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const pageError = error || null;

    if (loading && !userProfile && !user) return <div className="loading-container">Loading profile...</div>;
    if (pageError && !userProfile && !user) return <div className="error-container">Error: {String(pageError)}. Could not load user or profile.</div>;
    if (!user && !loading) return <div className="error-container">User not authenticated. Please login.</div>;

    const displayLoginId = user ? user.user_id : 'N/A';

    const headerDisplayName = isEditing ? (editedProfile.userName || displayLoginId)
        : (userProfile?.userName || displayLoginId);

    const viewModeDisplayName = userProfile?.userName || displayLoginId;

    return (
        <>
            <Header pageTitle="Profile Details" showDashboardButton={true} />
            <div className="profile-detail-container">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {getInitials()}
                    </div>
                    <div className="profile-header-info">
                        <h1>{headerDisplayName}</h1>
                        <p className="profile-subtitle">{isEditing ? (editedProfile.futureSkills || '') : (userProfile?.futureSkills || 'Learning in progress')}</p>
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
                                        🔄 Chat with AI Assistant
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

                {pageError && <div className="error-container" style={{ margin: '1rem 0', color: 'red' }}>Failed to load/save: {String(pageError)}</div>}

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>👤 Account Information</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label htmlFor="userIdDisplay">User ID (Cannot be changed)</label>
                                <input
                                    type="text"
                                    id="userIdDisplay"
                                    value={displayLoginId}
                                    readOnly
                                    disabled
                                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                />
                            </div>
                            <div className="field-group">
                                <label htmlFor="userNameEdit">Display Name *</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        id="userNameEdit"
                                        value={editedProfile.userName || ''}
                                        onChange={(e) => handleInputChange('userName', e.target.value)}
                                        placeholder="Your public display name"
                                        required
                                    />
                                ) : (
                                    <div className="field-value">{viewModeDisplayName}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Personal Reference</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label htmlFor="showOnLeaderboardEdit" style={{ margin: 0, fontWeight: 500 }}>Include in Leaderboard</label>
                                {isEditing ? (
                                    <label style={{ display: 'inline-block', position: 'relative', width: '48px', height: '28px', verticalAlign: 'middle' }}>
                                        <input
                                            type="checkbox"
                                            id="showOnLeaderboardEdit"
                                            checked={editedProfile.showOnLeaderboard !== false}
                                            onChange={e => handleInputChange('showOnLeaderboard', e.target.checked)}
                                            style={{ opacity: 0, width: 0, height: 0 }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: editedProfile.showOnLeaderboard !== false ? '#4caf50' : '#ccc',
                                            borderRadius: '28px',
                                            transition: 'background 0.2s',
                                            display: 'block'
                                        }}></span>
                                        <span style={{
                                            position: 'absolute',
                                            left: editedProfile.showOnLeaderboard !== false ? '22px' : '2px',
                                            top: '2px',
                                            width: '24px',
                                            height: '24px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                            transition: 'left 0.2s'
                                        }}></span>
                                    </label>
                                ) : (
                                    <div className="field-value">{userProfile?.showOnLeaderboard === false ? 'Not included' : 'Included'}</div>
                                )}
                            </div>
                            <div className="field-group">
                                <label htmlFor="notificationsPreferenceEdit">Notification Preferences</label>
                                {isEditing ? (
                                    <select
                                        id="notificationsPreferenceEdit"
                                        value={editedProfile.notificationsPreference || ''}
                                        onChange={(e) => handleInputChange('notificationsPreference', e.target.value)}
                                    >
                                        <option value="">Select preference</option>
                                        <option value="Yes">Yes, send me updates</option>
                                        <option value="No">No notifications</option>
                                    </select>
                                ) : (
                                    <div className="field-value">{userProfile?.notificationsPreference || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>🎯 Learning Goals</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label htmlFor="futureSkillsEdit">Future Skills & Goals</label>
                                {isEditing ? (
                                    <textarea
                                        id="futureSkillsEdit"
                                        value={editedProfile.futureSkills || ''}
                                        onChange={(e) => handleInputChange('futureSkills', e.target.value)}
                                        placeholder="What skills do you want to learn?"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.futureSkills || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="currentSkillsEdit">Current Skills & Experience</label>
                                {isEditing ? (
                                    <textarea
                                        id="currentSkillsEdit"
                                        value={editedProfile.currentSkills || ''}
                                        onChange={(e) => handleInputChange('currentSkills', e.target.value)}
                                        placeholder="Describe your current technical background"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.currentSkills || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="endGoalMotivationEdit">End Goal & Motivation</label>
                                {isEditing ? (
                                    <textarea
                                        id="endGoalMotivationEdit"
                                        value={editedProfile.endGoalMotivation || ''}
                                        onChange={(e) => handleInputChange('endGoalMotivation', e.target.value)}
                                        placeholder="What's your ultimate goal with this learning?"
                                        rows="3"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.endGoalMotivation || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>📚 Learning Preferences</h2>
                        <div className="profile-fields">
                            <div className="field-group">
                                <label htmlFor="preferredLearningStyleEdit">Preferred Learning Style</label>
                                {isEditing ? (
                                    <textarea
                                        id="preferredLearningStyleEdit"
                                        value={editedProfile.preferredLearningStyle || ''}
                                        onChange={(e) => handleInputChange('preferredLearningStyle', e.target.value)}
                                        placeholder="How do you prefer to learn? (videos, hands-on, reading, etc.)"
                                        rows="2"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.preferredLearningStyle || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="learningPreferencesEdit">Learning Activity Preferences</label>
                                {isEditing ? (
                                    <textarea
                                        id="learningPreferencesEdit"
                                        value={editedProfile.learningPreferences || ''}
                                        onChange={(e) => handleInputChange('learningPreferences', e.target.value)}
                                        placeholder="What types of activities engage you most?"
                                        rows="2"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.learningPreferences || 'Not specified'}</div>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="timeCommitmentEdit">Time Commitment</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        id="timeCommitmentEdit"
                                        value={editedProfile.timeCommitment || ''}
                                        onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
                                        placeholder="How many hours per week can you dedicate?"
                                    />
                                ) : (
                                    <div className="field-value">{userProfile?.timeCommitment || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default UserProfileDetailPage; 