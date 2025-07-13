import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = "http://localhost:8000/api";

const Quiz = ({
    moduleId,
    quizData,
    onQuizComplete,
    onQuizClose,
    isAuthenticated
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60); // Convert to seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [isPassed, setIsPassed] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const timerRef = useRef(null);
    const { user } = useAuth();

    // Timer effect
    useEffect(() => {
        if (!isSubmitted && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Time's up, auto-submit
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isSubmitted, timeLeft]);

    // Start timer when quiz begins
    useEffect(() => {
        setStartTime(new Date());
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, answerIndex) => {
        if (isSubmitted) return;

        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitted) return;

        setIsSubmitted(true);
        setEndTime(new Date());

        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = quizData.questions.length;

        quizData.questions.forEach(question => {
            const userAnswer = answers[question.id];
            if (userAnswer === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
        setScore(calculatedScore);
        setIsPassed(calculatedScore >= quizData.passingScore);
        setShowResults(true);

        // Clear timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Send results to backend if authenticated
        if (isAuthenticated && user) {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                const timeSpent = Math.round((endTime - startTime) / 1000 / 60); // Convert to minutes

                const response = await fetch(`${API_BASE_URL}/analytics/track-module-progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        module_id: moduleId,
                        quiz_score: calculatedScore,
                        quiz_time_spent_minutes: timeSpent,
                        quiz_passed: calculatedScore >= quizData.passingScore,
                        completed: calculatedScore >= quizData.passingScore // Auto-complete if passed
                    })
                });

                if (response.ok) {
                    console.log('Quiz results saved successfully');
                } else {
                    console.warn('Failed to save quiz results:', response.status);
                }
            } catch (error) {
                console.error('Error saving quiz results:', error);
            }
        }
    };

    const handleRetake = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setTimeLeft(quizData.timeLimit * 60);
        setIsSubmitted(false);
        setShowResults(false);
        setScore(0);
        setIsPassed(false);
        setStartTime(new Date());
        setEndTime(null);
    };

    const handleContinue = () => {
        if (onQuizComplete) {
            onQuizComplete({
                score,
                isPassed,
                timeSpent: Math.round((endTime - startTime) / 1000 / 60)
            });
        }
    };

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const totalQuestions = quizData.questions.length;
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    if (showResults) {
        return (
            <div className="quiz-result-card">
                <div className="quiz-result-header">
                    <span className="quiz-title">{quizData.title}</span>
                    <button className="close-btn" onClick={onQuizClose}>×</button>
                </div>
                <div className="quiz-result-body">
                    <div className="congrats-row">
                        {isPassed ? (
                            <>
                                <span className="congrats-icon">🎉</span>
                                <span className="congrats-text">Congratulations!</span>
                            </>
                        ) : (
                            <>
                                <span className="congrats-icon">📚</span>
                                <span className="congrats-text failed">Keep Learning!</span>
                            </>
                        )}
                    </div>
                    <div className="score-row">
                        <span className="score-number">{score}%</span>
                        <span className={`score-status ${isPassed ? 'passed' : 'failed'}`}>{isPassed ? 'Passed' : 'Failed'}</span>
                    </div>
                    <div className="score-desc">
                        {isPassed
                            ? `You passed the quiz! (Minimum required: ${quizData.passingScore}%)`
                            : `You scored ${score}%. You need at least ${quizData.passingScore}% to pass.`
                        }
                    </div>
                </div>
                <div className="quiz-breakdown">
                    <h4>Question Breakdown</h4>
                    {quizData.questions.map((question, index) => {
                        const userAnswer = answers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;
                        return (
                            <div key={question.id} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="question-header">
                                    <span className="question-number">Q{index + 1}</span>
                                    <span className="question-status">
                                        {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                    </span>
                                </div>
                                <p className="question-text">{question.question}</p>
                                {!isCorrect && (
                                    <div className="explanation">
                                        <strong>Explanation:</strong> {question.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="quiz-actions">
                    {!isPassed && (
                        <button className="secondary-btn" onClick={handleRetake}>
                            🔄 Retake Quiz
                        </button>
                    )}
                    <button className="primary-btn" onClick={handleContinue}>
                        {isPassed ? '🎯 Continue Learning' : '📚 Back to Module'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header ubs-title-bar">
                <div className="ubs-title-line"></div>
                <div>
                    <h2 className="ubs-title">{quizData.title}</h2>
                    <p className="ubs-desc">{quizData.description}</p>
                </div>
                <button className="close-btn" onClick={onQuizClose}>×</button>
            </div>

            <div className="quiz-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="progress-info">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <span className="timer">⏱️ {formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="question-container">
                <div className="question-header">
                    <span className="question-number">Question {currentQuestionIndex + 1}</span>
                    <span className="question-type">Multiple Choice</span>
                </div>

                <h3 className="question-text">{currentQuestion.question}</h3>

                <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                        <label
                            key={index}
                            className={`option-label ${answers[currentQuestion.id] === index ? 'selected' : ''}`}
                        >
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={index}
                                checked={answers[currentQuestion.id] === index}
                                onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                                disabled={isSubmitted}
                            />
                            <span className="option-text">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="quiz-navigation">
                <button
                    className="secondary-btn"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    ← Previous
                </button>

                <div className="question-dots">
                    {quizData.questions.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentQuestionIndex ? 'active' : ''} ${answers[quizData.questions[index].id] !== undefined ? 'answered' : ''}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                        className="primary-btn"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        disabled={answers[currentQuestion.id] === undefined}
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        className="primary-btn"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < totalQuestions}
                    >
                        Submit Quiz
                    </button>
                )}
            </div>

            <div className="quiz-footer">
                <p className="quiz-instructions">
                    💡 Make sure to answer all questions before submitting. You can navigate between questions using the dots above.
                </p>
            </div>
        </div>
    );
};

export default Quiz; 