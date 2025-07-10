import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReadingTracker from '../components/ReadingTracker';
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
    const [actualWatchTime, setActualWatchTime] = useState(0); // 实际观看时间
    const [actualReadingTime, setActualReadingTime] = useState(0); // 实际阅读时间
    const [referenceReadingTime, setReferenceReadingTime] = useState(0);
    const [referenceReadingProgress, setReferenceReadingProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0); // 视频观看进度 0-100%
    const [readingProgress, setReadingProgress] = useState(0); // 阅读进度 0-100%
    const [youtubeApiReady, setYoutubeApiReady] = useState(false); // Track YouTube API readiness
    const [progressRestored, setProgressRestored] = useState(false); // Track if progress was restored
    const [activeTab, setActiveTab] = useState('video'); // 当前活跃标签页: 'video' 或 'reading'

    // YouTube Player相关状态
    const playerRef = useRef(null);
    const watchTimeTrackerRef = useRef({
        lastPlayTime: null,
        totalWatchTime: 0,
        isPlaying: false,
        progressTimer: null
    });

    // Load analytics for this module on mount or when userProfile changes
    useEffect(() => {
        console.log('Loading analytics for module:', moduleId, 'userProfile:', userProfile);

        if (userProfile) {
            // Check if module is completed based on completed_modules list
            const isModuleCompleted = userProfile.completed_modules?.includes(moduleId) || false;
            setIsCompleted(isModuleCompleted);

            // Load actual watch time and reading time from analytics if available
            if (userProfile.analytics && userProfile.analytics.module_progress) {
                const progress = userProfile.analytics.module_progress[moduleId] || {};
                const savedWatchTime = progress.actual_watch_time_minutes || 0;
                const savedReadingTime = progress.actual_reading_time_minutes || 0;
                const savedVideoProgress = progress.video_progress_percentage || 0;
                const savedReadingProgress = progress.reading_progress_percentage || 0;

                setActualWatchTime(savedWatchTime);
                setActualReadingTime(savedReadingTime);
                setVideoProgress(savedVideoProgress);
                setReadingProgress(savedReadingProgress);
                watchTimeTrackerRef.current.totalWatchTime = savedWatchTime * 60; // Convert to seconds for internal tracking

                // Reference Reading 恢复
                const referenceKey = moduleId + '_reference';
                const referenceProgress = userProfile.analytics.module_progress[referenceKey] || {};
                setReferenceReadingTime(referenceProgress.reference_reading_time_minutes || 0);
                setReferenceReadingProgress(referenceProgress.reference_reading_progress_percentage || 0);

                // Show progress restored message if there's meaningful progress
                if (savedWatchTime > 0 || savedVideoProgress > 0 || savedReadingTime > 0 || savedReadingProgress > 0) {
                    setProgressRestored(true);
                    setTimeout(() => setProgressRestored(false), 5000);
                }
            } else {
                setActualWatchTime(0);
                setActualReadingTime(0);
                setVideoProgress(0);
                setReadingProgress(0);
                watchTimeTrackerRef.current.totalWatchTime = 0;
                setReferenceReadingTime(0);
                setReferenceReadingProgress(0);
            }
        } else {
            setActualWatchTime(0);
            setActualReadingTime(0);
            setVideoProgress(0);
            setReadingProgress(0);
            watchTimeTrackerRef.current.totalWatchTime = 0;
            setIsCompleted(false);
            setReferenceReadingTime(0);
            setReferenceReadingProgress(0);
        }
    }, [userProfile, moduleId]);

    useEffect(() => {
        const data = modulesData[moduleId];
        if (data) {
            setModuleInfo(data);
        } else {
            setModuleInfo({
                title: moduleId ? moduleId.replace(/_/g, ' ') : "Unknown Module",
                error: "Content for this module was not found."
            });
        }

        // Load YouTube API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // Define the callback for when API is ready
            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube API is ready');
                setYoutubeApiReady(true);
            };
        } else if (window.YT && window.YT.Player) {
            console.log('YouTube API already loaded');
            setYoutubeApiReady(true);
        }

        // Cleanup function
        return () => {
            // Clear progress timer if it exists
            if (watchTimeTrackerRef.current.progressTimer) {
                clearInterval(watchTimeTrackerRef.current.progressTimer);
                watchTimeTrackerRef.current.progressTimer = null;
            }

            // Save final watch time when leaving the page
            if (isAuthenticated && !isCompleted) {
                updateVideoProgress();
            }
        };
    }, [moduleId, isAuthenticated, isCompleted]);

    // 新增 useEffect 监听 activeTab，切换到 video 时重新初始化播放器
    useEffect(() => {
        if (activeTab === 'video' && moduleInfo && moduleInfo.videoId && !isCompleted && youtubeApiReady) {
            // 确保 DOM 已渲染
            setTimeout(() => {
                initializePlayer();
            }, 0);
        } else if (activeTab !== 'video') {
            // 切换到非video标签时，销毁播放器
            if (playerRef.current) {
                try {
                    if (watchTimeTrackerRef.current.progressTimer) {
                        clearInterval(watchTimeTrackerRef.current.progressTimer);
                        watchTimeTrackerRef.current.progressTimer = null;
                    }
                    playerRef.current.destroy();
                } catch (e) {
                    // 忽略销毁异常
                }
                playerRef.current = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, moduleInfo, isCompleted, youtubeApiReady]);

    const initializePlayer = () => {
        if (!moduleInfo?.videoId || isCompleted || !youtubeApiReady) {
            return;
        }
        // 检查DOM
        const playerDiv = document.getElementById('youtube-player');
        if (!playerDiv) {
            // DOM未渲染，延迟重试
            setTimeout(initializePlayer, 100);
            return;
        }
        // Remove existing player if any
        if (playerRef.current) {
            try {
                if (watchTimeTrackerRef.current.progressTimer) {
                    clearInterval(watchTimeTrackerRef.current.progressTimer);
                    watchTimeTrackerRef.current.progressTimer = null;
                }
                playerRef.current.destroy();
            } catch (e) { }
            playerRef.current = null;
        }
        try {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '720',
                width: '1280',
                videoId: moduleInfo.videoId,
                playerVars: {
                    'playsinline': 1,
                    'rel': 0
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
        } catch (error) {
            console.error('Error creating YouTube player:', error);
        }
    };

    const onPlayerReady = (event) => {
        console.log('YouTube player ready');

        // If we have saved progress, seek to that position
        if (actualWatchTime > 0 || videoProgress > 0) {
            const player = event.target;
            const videoDuration = player.getDuration();

            if (videoDuration > 0 && videoProgress > 0) {
                // Calculate the time position based on progress percentage
                const seekTime = (videoProgress / 100) * videoDuration;
                console.log('Seeking to saved position:', {
                    videoProgress: videoProgress.toFixed(1) + '%',
                    seekTime: seekTime.toFixed(1) + 's',
                    videoDuration: videoDuration.toFixed(1) + 's'
                });

                // Seek to the saved position
                player.seekTo(seekTime, true);

                // Show a brief message about the seek
                setProgressRestored(true);
                setTimeout(() => setProgressRestored(false), 3000);
            }
        }
    };

    const onPlayerError = (event) => {
        console.error('YouTube player error:', event.data);
        // Handle player errors gracefully
    };

    const onPlayerStateChange = (event) => {
        const player = event.target;
        const currentTime = Date.now();

        console.log('Player state changed:', event.data);
        console.log('Current tracker state:', watchTimeTrackerRef.current);

        switch (event.data) {
            case window.YT.PlayerState.PLAYING:
                console.log('Video started playing');
                watchTimeTrackerRef.current.isPlaying = true;
                watchTimeTrackerRef.current.lastPlayTime = currentTime;

                // Start a timer to update progress every few seconds while playing
                if (!watchTimeTrackerRef.current.progressTimer) {
                    watchTimeTrackerRef.current.progressTimer = setInterval(() => {
                        if (watchTimeTrackerRef.current.isPlaying && watchTimeTrackerRef.current.lastPlayTime && playerRef.current) {
                            const now = Date.now();
                            const sessionTime = (now - watchTimeTrackerRef.current.lastPlayTime) / 1000;
                            const newTotalTime = watchTimeTrackerRef.current.totalWatchTime + sessionTime;

                            // Also get current video position from player for accuracy
                            try {
                                const currentVideoTime = playerRef.current.getCurrentTime();
                                const videoDuration = playerRef.current.getDuration();

                                if (videoDuration > 0) {
                                    const currentProgress = (currentVideoTime / videoDuration) * 100;
                                    setVideoProgress(Math.min(100, currentProgress));
                                }
                            } catch (e) {
                                // Fallback to time-based calculation if player methods fail
                                console.log('Player methods not available, using time-based calculation');
                            }

                            console.log('Progress update - Session time:', sessionTime, 'Total time:', newTotalTime);

                            // Update the last play time for next calculation
                            watchTimeTrackerRef.current.lastPlayTime = now;
                            watchTimeTrackerRef.current.totalWatchTime = newTotalTime;

                            updateDisplayTime();
                            updateVideoProgress();
                        }
                    }, 3000); // Update every 3 seconds for more responsive tracking
                }
                break;

            case window.YT.PlayerState.PAUSED:
                console.log('Video paused');
                if (watchTimeTrackerRef.current.isPlaying && watchTimeTrackerRef.current.lastPlayTime) {
                    const sessionTime = (currentTime - watchTimeTrackerRef.current.lastPlayTime) / 1000;
                    watchTimeTrackerRef.current.totalWatchTime += sessionTime;
                    console.log('Paused - Session time:', sessionTime, 'Total time:', watchTimeTrackerRef.current.totalWatchTime);
                    updateDisplayTime();
                    updateVideoProgress();
                }
                watchTimeTrackerRef.current.isPlaying = false;
                watchTimeTrackerRef.current.lastPlayTime = null;

                // Clear the progress timer
                if (watchTimeTrackerRef.current.progressTimer) {
                    clearInterval(watchTimeTrackerRef.current.progressTimer);
                    watchTimeTrackerRef.current.progressTimer = null;
                }
                break;

            case window.YT.PlayerState.ENDED:
                console.log('Video ended');
                if (watchTimeTrackerRef.current.isPlaying && watchTimeTrackerRef.current.lastPlayTime) {
                    const sessionTime = (currentTime - watchTimeTrackerRef.current.lastPlayTime) / 1000;
                    watchTimeTrackerRef.current.totalWatchTime += sessionTime;
                    updateDisplayTime();
                }
                watchTimeTrackerRef.current.isPlaying = false;
                watchTimeTrackerRef.current.lastPlayTime = null;

                // Clear the progress timer
                if (watchTimeTrackerRef.current.progressTimer) {
                    clearInterval(watchTimeTrackerRef.current.progressTimer);
                    watchTimeTrackerRef.current.progressTimer = null;
                }

                // Calculate final progress percentage
                const videoDuration = player.getDuration();
                const watchedPercentage = Math.min(100, (watchTimeTrackerRef.current.totalWatchTime / videoDuration) * 100);
                console.log('Video ended - Duration:', videoDuration, 'Watch time:', watchTimeTrackerRef.current.totalWatchTime, 'Percentage:', watchedPercentage);
                setVideoProgress(watchedPercentage);
                updateVideoProgress();

                // Auto-suggest completion if user watched most of the video
                if (watchedPercentage >= 80) {
                    const shouldComplete = window.confirm(
                        `You have watched ${watchedPercentage.toFixed(1)}% of the video content. Would you like to mark this module as complete?`
                    );
                    if (shouldComplete) {
                        handleComplete();
                    }
                }
                break;

            default:
                break;
        }
    };

    const updateDisplayTime = () => {
        const minutes = Math.floor(watchTimeTrackerRef.current.totalWatchTime / 60);
        console.log('Updating display time:', minutes, 'minutes from', watchTimeTrackerRef.current.totalWatchTime, 'seconds');
        setActualWatchTime(minutes);
    };

    // 处理阅读时间更新
    const handleReadingTimeUpdate = async (readingData, trackerModuleId = moduleId) => {
        if (!isAuthenticated) return;
        const isReference = trackerModuleId.endsWith('_reference');
        if (isReference) {
            setReferenceReadingTime(readingData.actual_reading_time_minutes);
            setReferenceReadingProgress(readingData.reading_progress_percentage);
        } else {
            setActualReadingTime(readingData.actual_reading_time_minutes);
            setReadingProgress(readingData.reading_progress_percentage);
        }
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/analytics/track-module-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    module_id: trackerModuleId,
                    actual_reading_time_minutes: isReference ? 0 : readingData.actual_reading_time_minutes,
                    reading_progress_percentage: isReference ? 0 : readingData.reading_progress_percentage,
                    reference_reading_time_minutes: isReference ? readingData.actual_reading_time_minutes : 0,
                    reference_reading_progress_percentage: isReference ? readingData.reading_progress_percentage : 0,
                    is_reference: isReference,
                    completed: false
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('401 received, but not forcing logout during reading');
                    return;
                }
                console.warn('Failed to update reading progress:', response.status);
            } else {
                console.log('Reading progress updated successfully');
            }
        } catch (error) {
            console.error('Error updating reading progress:', error);
        }
    };

    const updateVideoProgress = async () => {
        if (!isAuthenticated || !playerRef.current) return;

        try {
            const videoDuration = playerRef.current.getDuration();
            const currentProgress = videoDuration > 0 ?
                Math.min(100, (watchTimeTrackerRef.current.totalWatchTime / videoDuration) * 100) : 0;

            setVideoProgress(currentProgress);

            const token = localStorage.getItem('authToken');
            if (!token) return;

            // Simplified token check - less strict
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const expTime = payload.exp * 1000;
                    const now = Date.now();

                    // Give 5 minute buffer before logout
                    if (expTime < (now - 300000)) {
                        console.warn('Token expired, will refresh on next navigation');
                        return; // Don't logout immediately, just skip this update
                    }
                }
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
                return; // Don't logout, just skip this update
            }

            const response = await fetch(`${API_BASE_URL}/analytics/track-module-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    module_id: moduleId,
                    actual_watch_time_minutes: Math.floor(watchTimeTrackerRef.current.totalWatchTime / 60),
                    video_progress_percentage: currentProgress,
                    completed: false
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('401 received, but not forcing logout during video watching');
                    return; // Don't logout during video watching
                }
                console.warn('Failed to update video progress:', response.status);
            } else {
                console.log('Video progress updated successfully');
            }
        } catch (error) {
            console.error('Error updating video progress:', error);
            // Don't logout on network errors
        }
    };

    const handleComplete = async () => {
        if (isCompleted) return;

        // Final update of watch time if video is still playing
        if (watchTimeTrackerRef.current.isPlaying && watchTimeTrackerRef.current.lastPlayTime) {
            const currentTime = Date.now();
            const sessionTime = (currentTime - watchTimeTrackerRef.current.lastPlayTime) / 1000;
            watchTimeTrackerRef.current.totalWatchTime += sessionTime;
            updateDisplayTime();
        }

        setIsCompleted(true);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.warn('No token available for completion');
                return;
            }

            const videoDuration = playerRef.current ? playerRef.current.getDuration() : 0;
            const finalProgress = videoDuration > 0 ?
                Math.min(100, (watchTimeTrackerRef.current.totalWatchTime / videoDuration) * 100) : 100;

            const response = await fetch(`${API_BASE_URL}/analytics/track-module-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    module_id: moduleId,
                    actual_watch_time_minutes: Math.floor(watchTimeTrackerRef.current.totalWatchTime / 60),
                    actual_reading_time_minutes: actualReadingTime,
                    video_progress_percentage: finalProgress,
                    reading_progress_percentage: readingProgress,
                    completed: true
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Module completed successfully:', responseData);

                if (userProfile) {
                    await fetchUserProfile(userProfile._id || userProfile.user_id);
                }

                navigate('/dashboard');
            } else {
                console.warn('Failed to complete module:', response.status);
                // Still navigate to dashboard even if API call fails
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error completing module:', error);
            // Still navigate to dashboard even if there's an error
            navigate('/dashboard');
        }
    };

    if (!moduleInfo) return <div>Loading module...</div>;

    const pageTitle = `Module: ${moduleInfo.title}`;

    // 计算阅读材料的预计时间
    const estimatedReadingTime = moduleInfo.readingContent ? (moduleInfo.readingContent.estimatedReadingTime || 0) : 0;

    // 完成按钮可用条件
    const canMarkComplete =
        videoProgress >= 20 &&
        readingProgress === 100 &&
        actualReadingTime >= estimatedReadingTime;

    // summary区域合并统计
    const totalReadingTime = actualReadingTime + referenceReadingTime;
    const totalReadingProgress = moduleInfo && moduleInfo.readingContent && moduleInfo.references && moduleInfo.references.sections
        ? (readingProgress + referenceReadingProgress) / 2
        : readingProgress;

    return (
        <>
            <Header pageTitle={pageTitle} showDashboardButton={true} />
            <div className="module-container">
                <h2>{moduleInfo.error ? moduleInfo.title : `Content for ${moduleInfo.title}`}</h2>

                {moduleInfo.error && <p>{moduleInfo.error}</p>}

                {/* 标签页导航 */}
                {!moduleInfo.error && (
                    <div className="module-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                            onClick={() => setActiveTab('video')}
                        >
                            📹 Study Video
                        </button>
                        {moduleInfo.readingContent && (
                            <button
                                className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reading')}
                            >
                                📚 Reading Materials
                            </button>
                        )}
                        {moduleInfo.references && moduleInfo.references.sections && (
                            <button
                                className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reference')}
                            >
                                📖 Reference Reading
                            </button>
                        )}
                    </div>
                )}

                {/* 视频标签页内容 */}
                {!moduleInfo.error && moduleInfo.videoId && activeTab === 'video' && (
                    <>
                        <h3>Study Video</h3>
                        <div className="video-container">
                            {isCompleted ? (
                                <div className="video-completed-message">
                                    <p>✅ You have completed this module</p>
                                    <iframe
                                        width="100%"
                                        height="720"
                                        src={`https://www.youtube.com/embed/${moduleInfo.videoId}`}
                                        title={`YouTube video player - ${moduleInfo.title}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            ) : (
                                <>
                                    {!youtubeApiReady && (
                                        <div className="loading-message">
                                            <p>Loading YouTube Player...</p>
                                        </div>
                                    )}
                                    <div
                                        id="youtube-player"
                                        style={{
                                            display: youtubeApiReady ? 'block' : 'none',
                                            width: '100%',
                                            maxWidth: '1280px',
                                            height: '720px',
                                            margin: '0 auto'
                                        }}
                                    ></div>
                                </>
                            )}
                        </div>

                        {/* Progress Restored Message */}
                        {progressRestored && !isCompleted && (
                            <div className="progress-restored-message">
                                <span className="restore-icon">🔄</span>
                                Progress restored: {actualWatchTime} minutes watched ({videoProgress.toFixed(1)}%) - Video repositioned to last watched position
                            </div>
                        )}

                        {/* Video Progress Display */}
                        {!isCompleted && (
                            <div className="video-progress-info">
                                <div className="progress-bar-container">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${videoProgress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{videoProgress.toFixed(1)}% watched</span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 阅读标签页内容 */}
                {!moduleInfo.error && moduleInfo.readingContent && activeTab === 'reading' && (
                    <ReadingTracker
                        moduleId={moduleId}
                        readingContent={moduleInfo.readingContent}
                        onReadingTimeUpdate={(data) => handleReadingTimeUpdate(data, moduleId)}
                        initialReadingTime={actualReadingTime}
                        initialReadingProgress={readingProgress}
                        isAuthenticated={isAuthenticated}
                    />
                )}

                {/* 参考资料标签页内容 */}
                {!moduleInfo.error && moduleInfo.references && moduleInfo.references.sections && activeTab === 'reference' && (
                    <ReadingTracker
                        moduleId={moduleId + '_reference'}
                        readingContent={moduleInfo.references}
                        onReadingTimeUpdate={(data) => handleReadingTimeUpdate(data, moduleId + '_reference')}
                        initialReadingTime={referenceReadingTime}
                        initialReadingProgress={referenceReadingProgress}
                        isAuthenticated={isAuthenticated}
                    />
                )}

                {!moduleInfo.error && moduleInfo.references && moduleInfo.references.length > 0 && activeTab === 'video' && (
                    <>
                        <h3>Reference Materials & Books</h3>
                        <ul className="reference-list">
                            {moduleInfo.references.map((ref, index) => (
                                <li key={index}>
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.text}</a>
                                </li>
                            ))}
                            {moduleId === "python_fundamentals" &&
                                <li>"Python Crash Course, 3rd Edition" by Eric Matthes - (Consider linking to a bookstore)</li>
                            }
                        </ul>
                    </>
                )}

                {!moduleInfo.error && moduleInfo.topics && moduleInfo.topics.length > 0 && activeTab === 'video' && (
                    <>
                        <h3>Key Topics Covered</h3>
                        <ul className="key-topics-list">
                            {moduleInfo.topics.map((topic, index) => (
                                <li key={index}>{topic}</li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Enhanced Progress Tracking */}
                <div className="module-progress">
                    <div className="watch-time-stats">
                        <div className="stat-item">
                            <span className="stat-label">Video Watch Time:</span>
                            <span className="stat-value">{actualWatchTime} minutes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Reading Time:</span>
                            <span className="stat-value">{totalReadingTime} minutes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Total Learning Time:</span>
                            <span className="stat-value">{actualWatchTime + totalReadingTime} minutes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Video Progress:</span>
                            <span className="stat-value">{videoProgress.toFixed(1)}%</span>
                        </div>
                        {moduleInfo.readingContent && (
                            <div className="stat-item">
                                <span className="stat-label">Reading Progress:</span>
                                <span className="stat-value">{totalReadingProgress.toFixed(1)}%</span>
                            </div>
                        )}
                    </div>

                    {isCompleted ? (
                        <div className="completion-status">
                            <p style={{ color: 'green', fontWeight: 'bold' }}>
                                ✅ Module Completed!
                            </p>
                            <p style={{ color: '#666' }}>
                                This module is complete. Total learning time: {actualWatchTime + totalReadingTime} minutes (Video: {actualWatchTime}min, Reading: {totalReadingTime}min)
                            </p>
                        </div>
                    ) : (
                        <div className="completion-actions">
                            <button
                                className="primary-btn"
                                onClick={handleComplete}
                                disabled={!canMarkComplete}
                                title={
                                    !canMarkComplete
                                        ? `You must: 1) Watch at least 20% of the video, 2) Finish all reading materials, 3) Spend at least ${estimatedReadingTime} minutes reading.`
                                        : ""
                                }
                            >
                                Mark as Complete
                            </button>
                            {!canMarkComplete && (
                                <p className="completion-hint">
                                    💡 To complete this module, you must:
                                    <ul>
                                        <li>Watch at least 20% of the video ({videoProgress.toFixed(1)}% watched)</li>
                                        <li>Finish all reading materials ({readingProgress.toFixed(1)}% read)</li>
                                        <li>Spend at least {estimatedReadingTime} minutes reading (You: {actualReadingTime} minutes)</li>
                                    </ul>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ModulePage;