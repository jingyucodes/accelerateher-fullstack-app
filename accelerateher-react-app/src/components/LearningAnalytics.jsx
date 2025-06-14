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
        current_month
    } = analytics;

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
                            width: `${(current_week.completed_hours / current_week.planned_hours) * 100}%`
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
        </div>
    );
};

export default LearningAnalytics; 