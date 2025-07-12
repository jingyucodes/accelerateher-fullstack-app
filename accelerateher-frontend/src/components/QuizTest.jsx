import React, { useState } from 'react';
import Quiz from './Quiz';

const QuizTest = () => {
    const [showQuiz, setShowQuiz] = useState(false);

    const testQuizData = {
        title: "Python Fundamentals Quiz",
        description: "Test your understanding of Python basics",
        passingScore: 70,
        timeLimit: 15,
        questions: [
            {
                id: 1,
                type: "multiple_choice",
                question: "What is the correct way to create a variable in Python?",
                options: [
                    "var name = 'John'",
                    "name = 'John'",
                    "let name = 'John'",
                    "const name = 'John'"
                ],
                correctAnswer: 1,
                explanation: "In Python, you simply use the assignment operator (=) to create variables. No declaration keywords like 'var', 'let', or 'const' are needed."
            },
            {
                id: 2,
                type: "multiple_choice",
                question: "Which of the following is NOT a Python data type?",
                options: [
                    "int",
                    "float",
                    "string",
                    "array"
                ],
                correctAnswer: 3,
                explanation: "Python doesn't have a built-in 'array' type. Instead, it uses 'list' for similar functionality."
            }
        ]
    };

    if (showQuiz) {
        return (
            <Quiz
                moduleId="test_module"
                quizData={testQuizData}
                onQuizComplete={(result) => {
                    console.log('Quiz completed:', result);
                    setShowQuiz(false);
                }}
                onQuizClose={() => setShowQuiz(false)}
                isAuthenticated={false}
            />
        );
    }

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Quiz Test Component</h1>
            <p>Click the button below to test the Quiz component:</p>
            <button
                onClick={() => setShowQuiz(true)}
                style={{
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                🚀 Start Test Quiz
            </button>
        </div>
    );
};

export default QuizTest; 