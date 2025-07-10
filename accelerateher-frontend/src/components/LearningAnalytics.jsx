import React from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';

const LearningAnalytics = () => {
    const { userProfile } = useUserProfile();
    const analytics = userProfile?.analytics;

    if (!analytics) {
        return (
            <div className="analytics-container">
                <p>Start learning to see your progress!</p>
            </div>
        );
    }

    const {
        total_completion_percentage,
        current_week,
        current_month,
        module_progress = {}
    } = analytics;

    // Calculate total actual watch time and reading time from all modules
    const totalActualWatchTime = Object.values(module_progress).reduce((total, module) => {
        return total + (module.actual_watch_time_minutes || 0);
    }, 0);

    const totalActualReadingTime = Object.values(module_progress).reduce((total, module) => {
        return total + (module.actual_reading_time_minutes || 0);
    }, 0);

    const totalLearningTime = totalActualWatchTime + totalActualReadingTime;

    // Calculate average completion rates
    const moduleProgressEntries = Object.values(module_progress);
    const avgVideoProgress = moduleProgressEntries.length > 0 ?
        moduleProgressEntries.reduce((sum, module) => sum + (module.video_progress_percentage || 0), 0) / moduleProgressEntries.length : 0;

    const avgReadingProgress = moduleProgressEntries.length > 0 ?
        moduleProgressEntries.reduce((sum, module) => sum + (module.reading_progress_percentage || 0), 0) / moduleProgressEntries.length : 0;

    return (
        <div className="analytics-container">
            {/* Overall Progress */}
            <div className="analytics-section">
                <h4>Overall Progress</h4>
                <div className="progress-circle">
                    <div className="progress-value">{Math.round(total_completion_percentage)}%</div>
                    <div className="progress-label">Course Completion</div>
                </div>
            </div>

            {/* Learning Time Analytics */}
            <div className="analytics-section">
                <h4>Learning Activities</h4>
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-value">{totalLearningTime} minutes</div>
                        <div className="stat-label">Total Learning Time</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{totalActualWatchTime} minutes</div>
                        <div className="stat-label">Video Watch Time</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{totalActualReadingTime} minutes</div>
                        <div className="stat-label">Reading Time</div>
                    </div>
                </div>
            </div>

            {/* Learning Progress Analytics */}
            <div className="analytics-section">
                <h4>Progress Overview</h4>
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-value">{avgVideoProgress.toFixed(1)}%</div>
                        <div className="stat-label">Avg Video Progress</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{avgReadingProgress.toFixed(1)}%</div>
                        <div className="stat-label">Avg Reading Progress</div>
                    </div>
                </div>
            </div>

            {/* Weekly Progress */}
            <div className="analytics-section">
                <h4>This Week</h4>
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-value">{Math.round(current_week.completed_hours)}h</div>
                        <div className="stat-label">of {current_week.planned_hours}h</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{current_week.completed_modules.length}</div>
                        <div className="stat-label">Modules Completed</div>
                    </div>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${Math.min(100, (current_week.completed_hours / current_week.planned_hours) * 100)}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* Monthly Progress */}
            <div className="analytics-section">
                <h4>This Month</h4>
                <div className="progress-stats">
                    <div className="stat-item">
                        <div className="stat-value">{Math.round(current_month.total_hours)}h</div>
                        <div className="stat-label">Total Hours</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{current_month.learning_velocity.toFixed(1)}</div>
                        <div className="stat-label">Modules/Week</div>
                    </div>
                </div>
            </div>

            {/* Detailed Module Progress */}
            {Object.keys(module_progress).length > 0 && (
                <div className="analytics-section">
                    <h4>Module Details</h4>
                    <div className="module-details">
                        {Object.entries(module_progress).map(([moduleId, progress]) => {
                            const totalModuleTime = (progress.actual_watch_time_minutes || 0) + (progress.actual_reading_time_minutes || 0);
                            return (
                                <div key={moduleId} className="module-detail-item">
                                    <div className="module-name">{moduleId.replace(/_/g, ' ')}</div>
                                    <div className="module-stats">
                                        <span className="total-time">{totalModuleTime}min total</span>
                                        <span className="watch-time">📹 {progress.actual_watch_time_minutes || 0}min</span>
                                        <span className="reading-time">📚 {progress.actual_reading_time_minutes || 0}min</span>
                                        <span className="video-progress">Video: {(progress.video_progress_percentage || 0).toFixed(1)}%</span>
                                        <span className="reading-progress">Reading: {(progress.reading_progress_percentage || 0).toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningAnalytics; 