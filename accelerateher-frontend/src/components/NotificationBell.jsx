import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useAuth } from '../contexts/AuthContext';

// 新增：导出全局通知管理钩子
export const notificationBellRef = { push: null };

const NotificationBell = ({ externalNotifications, setExternalNotifications }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { userProfile } = useUserProfile();
    const { user } = useAuth();
    const notificationRef = useRef(null);

    // Generate learning notifications based on user progress
    const generateLearningNotifications = () => {
        if (!userProfile || !userProfile.activeLearningPath) {
            return [];
        }

        const notifications = [];
        const completedModules = userProfile.completed_modules || [];
        const activePath = userProfile.activeLearningPath;
        const shouldSendNotifications = userProfile.notificationsPreference === 'Yes';

        // Find current module (first incomplete, unlocked module)
        const currentModule = activePath.modules?.find((module, index) => {
            const isCompleted = completedModules.includes(module.id);
            if (isCompleted) return false;

            // Check if all previous modules are completed (so this one is unlocked)
            const allPreviousCompleted = index === 0 ||
                activePath.modules.slice(0, index).every(prevModule =>
                    completedModules.includes(prevModule.id)
                );

            return allPreviousCompleted;
        });

        // Notification 1: Today's module reminder
        if (currentModule && shouldSendNotifications) {
            notifications.push({
                id: 'today-module',
                type: 'reminder',
                title: 'Continue Your Learning Journey',
                message: `Complete "${currentModule.text}" today to stay on track!`,
                timestamp: new Date().toISOString(),
                isRead: false,
                icon: '📚',
                action: {
                    type: 'navigate',
                    url: `/module/${currentModule.id}`
                }
            });
        }

        // Notification 2: Weekly progress reminder
        const analytics = userProfile.analytics;
        if (analytics?.current_week && shouldSendNotifications) {
            const weeklyGoal = parseInt(userProfile.timeCommitment?.match(/\d+/)?.[0] || '0');
            const completedHours = analytics.current_week.completed_hours || 0;
            const remainingHours = Math.max(0, weeklyGoal - completedHours);

            if (remainingHours > 0) {
                notifications.push({
                    id: 'weekly-progress',
                    type: 'progress',
                    title: 'Weekly Learning Goal',
                    message: `${remainingHours} hours remaining to reach your ${weeklyGoal}h weekly goal`,
                    timestamp: new Date().toISOString(),
                    isRead: false,
                    icon: '⏰',
                    action: {
                        type: 'navigate',
                        url: '/dashboard'
                    }
                });
            }
        }

        // Notification 3: Remaining modules in path (only if notifications enabled)
        const remainingModules = activePath.modules?.filter((module, index) => {
            const isCompleted = completedModules.includes(module.id);
            return !isCompleted;
        }) || [];

        if (remainingModules.length > 0 && shouldSendNotifications) {
            notifications.push({
                id: 'remaining-modules',
                type: 'info',
                title: 'Learning Path Progress',
                message: `${remainingModules.length} modules remaining in "${activePath.title}"`,
                timestamp: new Date().toISOString(),
                isRead: false,
                icon: '🎯',
                details: remainingModules.map(m => m.text),
                action: {
                    type: 'navigate',
                    url: '/dashboard'
                }
            });
        }

        // Notification 4: Streak encouragement (if applicable)
        if (analytics?.current_month?.streak_days > 0 && shouldSendNotifications) {
            notifications.push({
                id: 'streak-encouragement',
                type: 'achievement',
                title: 'Learning Streak! 🔥',
                message: `Amazing! You're on a ${analytics.current_month.streak_days}-day learning streak!`,
                timestamp: new Date().toISOString(),
                isRead: false,
                icon: '🔥',
                action: {
                    type: 'navigate',
                    url: '/dashboard'
                }
            });
        }

        return notifications;
    };

    // 新增：允许外部推送消息
    useEffect(() => {
        notificationBellRef.push = (notification) => {
            setNotifications(prev => [
                { ...notification, id: notification.id || (Date.now() + Math.random()), isRead: false, timestamp: new Date().toISOString() },
                ...prev
            ]);
        };
        return () => { notificationBellRef.push = null; };
    }, []);

    // 合并自动生成和外部推送的通知
    useEffect(() => {
        if (userProfile) {
            const autoNotifications = generateLearningNotifications();
            setNotifications(prev => {
                // 只添加新生成且id不重复的自动通知
                const prevIds = new Set(prev.map(n => n.id));
                const newAuto = autoNotifications.filter(n => !prevIds.has(n.id));
                return [...newAuto, ...prev];
            });
        }
    }, [userProfile]);

    // 动态计算未读数量
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.isRead).length);
    }, [notifications]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        // Mark as read
        setNotifications(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
            )
        );

        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Handle action
        if (notification.action?.type === 'navigate' && notification.action.url) {
            navigate(notification.action.url);
        }

        setShowNotifications(false);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    // Don't show notification bell if user hasn't set up profile yet or has disabled notifications
    if (!userProfile || !user || userProfile.notificationsPreference === 'No') {
        return null;
    }

    return (
        <div className="notification-bell-container" ref={notificationRef}>
            <button
                className="notification-bell-btn"
                onClick={toggleNotifications}
                aria-label="Notifications"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {showNotifications && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Learning Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="mark-all-read-btn">
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <span className="no-notifications-icon">🎓</span>
                                <p>You're all caught up!</p>
                                <small>Keep up the great learning momentum</small>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">{notification.icon}</div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        {notification.details && (
                                            <ul className="notification-details">
                                                {notification.details.slice(0, 3).map((detail, index) => (
                                                    <li key={index}>{detail}</li>
                                                ))}
                                                {notification.details.length > 3 && (
                                                    <li>...and {notification.details.length - 3} more</li>
                                                )}
                                            </ul>
                                        )}
                                        <div className="notification-time">
                                            {formatTimeAgo(notification.timestamp)}
                                        </div>
                                    </div>
                                    {!notification.isRead && <div className="unread-indicator"></div>}
                                </div>
                            ))
                        )}
                    </div>

                    {userProfile.notificationsPreference !== 'Yes' && (
                        <div className="notification-footer">
                            <small>💡 Enable notifications in your profile to get learning reminders</small>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell; 