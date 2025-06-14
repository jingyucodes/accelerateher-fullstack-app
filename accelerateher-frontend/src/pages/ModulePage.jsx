import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { modulesData } from '../data/mockData';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = "http://localhost:8000/api";

const ModulePage = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [moduleInfo, setModuleInfo] = useState(null);
    const { userProfile, fetchUserProfile } = useUserProfile();
    const { isAuthenticated, logout } = useAuth();
    const [timeSpent, setTimeSpent] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);



    // Load analytics for this module on mount or when userProfile changes
    useEffect(() => {
        if (userProfile) {
            // Check if module is completed based on completed_modules list
            const isModuleCompleted = userProfile.completed_modules?.includes(moduleId) || false;
            setIsCompleted(isModuleCompleted);

            // Load time spent from analytics if available
            if (userProfile.analytics && userProfile.analytics.module_progress && userProfile.analytics.module_progress[moduleId]) {
                const progress = userProfile.analytics.module_progress[moduleId];
                setTimeSpent(progress.time_spent_minutes || 0);
            } else {
                setTimeSpent(0);
            }
        } else {
            setTimeSpent(0);
            setIsCompleted(false);
        }
    }, [userProfile, moduleId]);

    useEffect(() => {
        const data = modulesData[moduleId];
        if (data) {
            setModuleInfo(data);
        } else {
            // Handle module not found, maybe set a default or error state
            setModuleInfo({
                title: moduleId ? moduleId.replace(/_/g, ' ') : "Unknown Module",
                error: "Content for this module was not found."
            });
        }

        // Start tracking time when component mounts
        const startTime = Date.now();

        // Only track time if module is not completed
        let progressInterval;
        if (!isCompleted) {
            // Send progress updates every minute
            progressInterval = setInterval(() => {
                const currentTime = Date.now();
                const minutesSpent = Math.floor((currentTime - startTime) / 60000) + timeSpent;
                setTimeSpent(minutesSpent);
                updateProgress(minutesSpent, false);
            }, 60000);
        }

        // Cleanup on unmount
        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            // Only update progress on unmount if module isn't completed and user is authenticated
            if (isAuthenticated && !isCompleted) {
                const finalTimeSpent = Math.floor((Date.now() - startTime) / 60000) + timeSpent;
                updateProgress(finalTimeSpent, false);
            }
        };
    }, [moduleId, isAuthenticated, isCompleted]);

    const updateProgress = async (minutes, completed) => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            console.error('User not authenticated, cannot update progress');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error('No auth token found');
                return;
            }

            // Check if token is expired
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const expTime = payload.exp * 1000;
                    const now = Date.now();

                    if (expTime < now) {
                        console.error('Token is expired');
                        logout();
                        navigate('/login');
                        return;
                    }
                }
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
            }

            const response = await fetch(`${API_BASE_URL}/analytics/track-module-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    module_id: moduleId,
                    time_spent_minutes: minutes,
                    completed: completed
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                if (response.status === 401) {
                    console.error('Authentication failed - token may be expired');
                    logout(); // Log out the user if token is invalid
                    navigate('/login'); // Redirect to login
                    return;
                }
                throw new Error('Failed to update progress');
            }

            // Get the response data to check if module was completed
            const responseData = await response.json();
            console.log('Backend response:', responseData);

            // Force profile refresh if module was completed
            if (completed && responseData.completed_modules) {
                console.log('Module completed, forcing profile refresh');
                await fetchUserProfile(userProfile?._id || userProfile?.user_id);
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleComplete = async () => {
        // Prevent re-completion
        if (isCompleted) {
            return;
        }

        setIsCompleted(true);
        await updateProgress(timeSpent, true);

        // Refresh the user profile to get updated progress
        if (userProfile) {
            await fetchUserProfile(userProfile._id || userProfile.user_id);
        }

        navigate('/dashboard');
    };

    if (!moduleInfo) return <div>Loading module...</div>;

    const pageTitle = `Module: ${moduleInfo.title}`;

    return (
        <>
            <Header pageTitle={pageTitle} showDashboardButton={true} />
            <div className="module-container">
                <h2>{moduleInfo.error ? moduleInfo.title : `Content for ${moduleInfo.title}`}</h2>

                {moduleInfo.error && <p>{moduleInfo.error}</p>}

                {!moduleInfo.error && moduleInfo.videoId && (
                    <>
                        <h3>Study Video</h3>
                        <div className="video-container">
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${moduleInfo.videoId}`}
                                title={`YouTube video player - ${moduleInfo.title}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </>
                )}

                {!moduleInfo.error && moduleInfo.references && moduleInfo.references.length > 0 && (
                    <>
                        <h3>Reference Materials & Books</h3>
                        <ul className="reference-list">
                            {moduleInfo.references.map((ref, index) => (
                                <li key={index}>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.text}</a>
                                </li>
                            ))}
                            {/* Example of a non-link item, adapt as needed */}
                            {moduleId === "python_fundamentals" &&
                                <li>"Python Crash Course, 3rd Edition" by Eric Matthes - (Consider linking to a bookstore)</li>
                            }
                        </ul>
                    </>
                )}

                {!moduleInfo.error && moduleInfo.topics && moduleInfo.topics.length > 0 && (
                    <>
                        <h3>Key Topics Covered</h3>
                        <ul className="key-topics-list">
                            {moduleInfo.topics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Progress Tracking */}
                <div className="module-progress">
                    <p>Time spent: {timeSpent} minutes</p>
                    {isCompleted ? (
                        <div className="completion-status">
                            <p style={{ color: 'green', fontWeight: 'bold' }}>
                                ✅ Module Completed!
                            </p>
                            <p style={{ color: '#666' }}>
                                This module has been marked as complete. Progress is no longer being tracked.
                            </p>
                        </div>
                    ) : (
                        <button
                            className="primary-btn"
                            onClick={handleComplete}
                        >
                            Mark as Complete
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default ModulePage;