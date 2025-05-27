// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';

const ChatMessage = ({ text, sender }) => (
    <div className={`chat-message ${sender}`}>{text}</div>
);

const UserProfilePage = () => {
    const { userProfile: initialProfileData, saveUserProfile, loading: contextLoading, error: contextError, currentUserId } = useUserProfile();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const userInputRef = useRef(null);
    const hasInitialized = useRef(false);
    const hasAskedQuestion = useRef(false);
    const hasGeneratedPath = useRef(false);
    const hasShownReview = useRef(false);

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [conversationState, setConversationState] = useState('GREETING');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [showFinalizeBtn, setShowFinalizeBtn] = useState(false);
    const [showChatInputArea, setShowChatInputArea] = useState(true);
    const [profileSummary, setProfileSummary] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [freeFormMessages, setFreeFormMessages] = useState([]);
    const [missingFields, setMissingFields] = useState([]);

    const [structuredProfile, setStructuredProfile] = useState({
        name: '',
        futureSkills: '',
        currentSkills: '',
        preferredLearningStyle: '',
        timeCommitment: '',
        learningPreferences: '',
        endGoalMotivation: '',
        notificationsPreference: ''
    });

    const questions = [
        { key: 'name', text: "What should I call you? (Your name or preferred nickname)" },
        { key: 'futureSkills', text: "What specific skills or technologies are you hoping to learn? (e.g., Python, cloud computing, web development)" },
        { key: 'currentSkills', text: "What's your current technical background or experience level?" },
        { key: 'preferredLearningStyle', text: "How do you prefer to learn? (e.g., videos, hands-on projects, reading, interactive tutorials)" },
        { key: 'timeCommitment', text: "How many hours per week can you dedicate to learning?" },
        { key: 'learningPreferences', text: "What types of learning activities engage you most? (e.g., coding exercises, case studies, quizzes)" },
        { key: 'endGoalMotivation', text: "What's your ultimate goal with this learning? (e.g., career change, promotion, personal interest)" },
        { key: 'notificationsPreference', text: "Would you like to receive email notifications for your learning progress? (Yes/No)" }
    ];

    const addMessage = useCallback((text, sender) => {
        setMessages(prev => [...prev, { text, sender, timestamp: Date.now() }]);
    }, []);

    const delay = useCallback((ms) => new Promise(resolve => setTimeout(resolve, ms)), []);

    // AI-like text analysis to extract profile information
    const extractProfileInfo = useCallback((userMessages) => {
        const allText = userMessages.join(' ').toLowerCase();
        const extracted = {};

        // Extract name (look for "I'm", "my name is", "call me", etc.)
        const namePatterns = [
            /(?:i'm|i am|my name is|call me|i go by)\s+([a-zA-Z]+)/i,
            /^([a-zA-Z]+)(?:\s|$)/i // First word if it looks like a name
        ];
        for (const pattern of namePatterns) {
            const match = allText.match(pattern);
            if (match && match[1] && match[1].length > 1) {
                extracted.name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                break;
            }
        }

        // Extract future skills/learning goals
        const skillKeywords = ['learn', 'study', 'master', 'understand', 'get into', 'interested in', 'want to', 'goal', 'hoping to'];
        const techKeywords = ['python', 'javascript', 'java', 'react', 'node', 'cloud', 'aws', 'azure', 'data science', 'machine learning', 'ai', 'web development', 'mobile', 'ios', 'android', 'devops', 'cybersecurity', 'blockchain'];

        for (const keyword of skillKeywords) {
            if (allText.includes(keyword)) {
                for (const tech of techKeywords) {
                    if (allText.includes(tech)) {
                        if (!extracted.futureSkills) extracted.futureSkills = '';
                        if (!extracted.futureSkills.includes(tech)) {
                            extracted.futureSkills += (extracted.futureSkills ? ', ' : '') + tech;
                        }
                    }
                }
            }
        }

        // Extract current skills/experience
        const experienceKeywords = ['experience', 'background', 'know', 'familiar', 'worked with', 'used', 'beginner', 'intermediate', 'advanced', 'expert', 'new to', 'started'];
        for (const keyword of experienceKeywords) {
            if (allText.includes(keyword)) {
                const sentences = userMessages.join(' ').split(/[.!?]/);
                for (const sentence of sentences) {
                    if (sentence.toLowerCase().includes(keyword)) {
                        if (!extracted.currentSkills) {
                            extracted.currentSkills = sentence.trim();
                            break;
                        }
                    }
                }
            }
        }

        // Extract learning preferences
        const learningKeywords = ['prefer', 'like', 'enjoy', 'best way', 'learn by', 'hands-on', 'video', 'reading', 'tutorial', 'project'];
        for (const keyword of learningKeywords) {
            if (allText.includes(keyword)) {
                const sentences = userMessages.join(' ').split(/[.!?]/);
                for (const sentence of sentences) {
                    if (sentence.toLowerCase().includes(keyword)) {
                        if (!extracted.preferredLearningStyle) {
                            extracted.preferredLearningStyle = sentence.trim();
                            break;
                        }
                    }
                }
            }
        }

        // Extract time commitment
        const timePatterns = [
            /(\d+)\s*(?:hours?|hrs?)\s*(?:per|a|each)?\s*week/i,
            /(\d+)\s*(?:hours?|hrs?)\s*(?:daily|per day)/i
        ];
        for (const pattern of timePatterns) {
            const match = allText.match(pattern);
            if (match) {
                extracted.timeCommitment = match[0];
                break;
            }
        }

        // Extract motivation/goals
        const motivationKeywords = ['career', 'job', 'promotion', 'change', 'switch', 'goal', 'dream', 'want to become', 'aspire'];
        for (const keyword of motivationKeywords) {
            if (allText.includes(keyword)) {
                const sentences = userMessages.join(' ').split(/[.!?]/);
                for (const sentence of sentences) {
                    if (sentence.toLowerCase().includes(keyword)) {
                        if (!extracted.endGoalMotivation) {
                            extracted.endGoalMotivation = sentence.trim();
                            break;
                        }
                    }
                }
            }
        }

        return extracted;
    }, []);

    const findMissingFields = useCallback((profile) => {
        const required = ['name', 'futureSkills', 'currentSkills', 'preferredLearningStyle', 'timeCommitment', 'endGoalMotivation', 'notificationsPreference'];
        return required.filter(field => !profile[field] || profile[field].trim() === '');
    }, []);

    const compileProfileDataForDisplay = useCallback((profile) => {
        let output = "--- YOUR PROFILE ---\n";
        output += `Name: ${profile.name || 'Not specified'}\n`;
        output += `Learning Goal: ${profile.futureSkills || 'Not specified'}\n`;
        output += `Current Knowledge: ${profile.currentSkills || 'Not specified'}\n`;
        output += `Learning Style: ${profile.preferredLearningStyle || 'Not specified'}\n`;
        output += `Time Commitment: ${profile.timeCommitment || 'Not specified'}\n`;
        output += `Learning Preferences: ${profile.learningPreferences || 'Not specified'}\n`;
        output += `Goals & Motivation: ${profile.endGoalMotivation || 'Not specified'}\n`;
        output += `Notifications: ${profile.notificationsPreference || 'Not specified'}\n`;
        return output;
    }, []);

    const suggestLearningPath = useCallback((profile) => {
        let path = "";
        const goal = profile.futureSkills?.toLowerCase() || "";
        if (goal.includes("cloud") || goal.includes("azure") || goal.includes("aws") || goal.includes("gcp")) {
            path += "Course to start with: Introduction to Cloud Computing (e.g., Cloud Practitioner Essentials / AZ-900)\n";
        } else if (goal.includes("python")) {
            path += "Course to start with: Python for Absolute Beginners\n";
        } else if (goal.includes("web develop") || goal.includes("javascript") || goal.includes("react")) {
            path += "Course to start with: HTML, CSS, and JavaScript Fundamentals\n";
        } else if (goal.includes("data science") || goal.includes("machine learning")) {
            path += "Course to start with: Introduction to Data Science with Python\n";
        } else {
            path += "Course to start with: Foundational Course in Your Area of Interest\n";
        }
        path += "\n(This is a personalized recommendation based on your profile!)";
        return path;
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Initialize conversation
    useEffect(() => {
        if (!contextLoading && conversationState === 'GREETING' && !hasInitialized.current) {
            hasInitialized.current = true;
            const initConversation = async () => {
                setInputDisabled(true);
                await delay(500);
                addMessage("Hi! I'm your Learning Platform Assistant. I'll help you create your personalized learning profile.", 'ai');
                await delay(1000);
                addMessage("Instead of going through a rigid questionnaire, I'd love to hear about your learning journey in your own words!", 'ai');
                await delay(800);
                addMessage("Tell me about yourself - what you want to learn, your background, your goals, or anything else you think is relevant. I'll listen and ask follow-up questions if needed.", 'ai');
                await delay(500);
                setConversationState('FREE_FORM_CHAT');
                setInputDisabled(false);
            };
            initConversation();
        }
    }, [contextLoading, conversationState, addMessage, delay]);

    // Handle free-form chat
    const handleFreeFormResponse = useCallback(async (userMessage) => {
        const newFreeFormMessages = [...freeFormMessages, userMessage];
        setFreeFormMessages(newFreeFormMessages);

        // Extract information from all messages so far
        const extractedInfo = extractProfileInfo(newFreeFormMessages);
        setStructuredProfile(prev => ({ ...prev, ...extractedInfo }));

        // Provide encouraging responses
        const responses = [
            "That's great! Tell me more about your learning journey.",
            "Interesting! What else would you like me to know?",
            "Thanks for sharing! Is there anything else about your goals or background?",
            "I'm getting a good picture of what you're looking for. Anything else to add?",
            "Perfect! Any other details about your learning preferences or timeline?"
        ];

        await delay(800);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'ai');
        await delay(500);
        addMessage("When you're ready, type 'done' or 'that's all' to move forward, or keep sharing!", 'ai');
        setInputDisabled(false);
    }, [freeFormMessages, extractProfileInfo, addMessage, delay]);

    // Handle transition to specific questions
    const handleTransitionToQuestions = useCallback(async () => {
        setInputDisabled(true);
        await delay(500);
        addMessage("Thank you for sharing! Let me analyze what you've told me...", 'ai');
        await delay(1500);

        const missing = findMissingFields(structuredProfile);
        setMissingFields(missing);

        if (missing.length === 0) {
            addMessage("Great! I have all the information I need. Let me prepare your learning path!", 'ai');
            setConversationState('GENERATING_PATH');
        } else {
            addMessage(`I have most of the information, but I'd like to ask a few specific questions to complete your profile. Just ${missing.length} more question${missing.length > 1 ? 's' : ''}!`, 'ai');
            await delay(800);
            setConversationState('ASKING_SPECIFIC_QUESTIONS');
            setCurrentQuestionIndex(0);
        }
    }, [structuredProfile, findMissingFields, addMessage, delay]);

    // Handle specific questions for missing fields
    useEffect(() => {
        if (conversationState === 'ASKING_SPECIFIC_QUESTIONS' && currentQuestionIndex < missingFields.length) {
            const questionKey = `${currentQuestionIndex}-${missingFields[currentQuestionIndex]}`;
            if (!hasAskedQuestion.current || hasAskedQuestion.current !== questionKey) {
                hasAskedQuestion.current = questionKey;
                const askSpecificQuestion = async () => {
                    await delay(500);
                    const fieldKey = missingFields[currentQuestionIndex];
                    const question = questions.find(q => q.key === fieldKey);
                    if (question) {
                        addMessage(question.text, 'ai');
                        setInputDisabled(false);
                    }
                };
                askSpecificQuestion();
            }
        } else if (conversationState === 'ASKING_SPECIFIC_QUESTIONS' && currentQuestionIndex >= missingFields.length) {
            setConversationState('GENERATING_PATH');
        }
    }, [conversationState, currentQuestionIndex, missingFields, questions, addMessage, delay]);

    // Handle path generation
    useEffect(() => {
        if (conversationState === 'GENERATING_PATH' && !hasGeneratedPath.current) {
            hasGeneratedPath.current = true;
            const generatePath = async () => {
                setInputDisabled(true);
                await delay(800);
                addMessage("Perfect! Based on everything you've shared, I'll create your personalized learning path...", 'ai');
                await delay(1500);

                const pOutput = compileProfileDataForDisplay(structuredProfile);
                const pSuggest = suggestLearningPath(structuredProfile);
                setProfileSummary(pOutput + "\n\n--- SUGGESTED LEARNING PATH ---\n" + pSuggest);
                setShowSummary(true);
                setConversationState('PATH_REVIEW');
            };
            generatePath();
        }
    }, [conversationState, structuredProfile, compileProfileDataForDisplay, suggestLearningPath, addMessage, delay]);

    // Handle path review
    useEffect(() => {
        if (conversationState === 'PATH_REVIEW' && !hasShownReview.current) {
            hasShownReview.current = true;
            const showReview = async () => {
                await delay(500);
                addMessage("Here's your complete profile and personalized learning path! Review it and click 'Start Learning' when you're ready to begin your journey.", 'ai');
                setShowFinalizeBtn(true);
                setShowChatInputArea(false);
            };
            showReview();
        }
    }, [conversationState, addMessage, delay]);

    const handleSend = () => {
        if (inputDisabled || !userInput.trim()) return;

        const text = userInput.trim();
        addMessage(text, 'user');
        setUserInput('');
        setInputDisabled(true);

        if (conversationState === 'FREE_FORM_CHAT') {
            // Check if user wants to finish free-form chat
            const finishKeywords = ['done', "that's all", 'finished', 'ready', 'move on', 'next', 'continue'];
            const isFinishing = finishKeywords.some(keyword => text.toLowerCase().includes(keyword));

            if (isFinishing) {
                handleTransitionToQuestions();
            } else {
                handleFreeFormResponse(text);
            }
        } else if (conversationState === 'ASKING_SPECIFIC_QUESTIONS') {
            // Save the answer to the specific question
            const fieldKey = missingFields[currentQuestionIndex];
            setStructuredProfile(prev => ({
                ...prev,
                [fieldKey]: text
            }));

            // Move to next question
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFinalize = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        addMessage("Saving your profile and setting up your learning journey...", 'ai');

        try {
            const profileToSave = { ...structuredProfile };
            Object.keys(profileToSave).forEach(key => {
                if (profileToSave[key] === 'Not specified') {
                    profileToSave[key] = '';
                }
            });

            const result = await saveUserProfile({
                ...profileToSave,
                user_id: currentUserId
            });

            if (result) {
                addMessage("Excellent! Your profile has been saved. Welcome to your personalized learning journey!", 'ai');
                await delay(1500);
                navigate('/dashboard');
            } else {
                addMessage("There was an issue saving your profile. Please try again.", 'ai');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            addMessage("Sorry, there was an error saving your profile. Please try again.", 'ai');
        } finally {
            setIsProcessing(false);
        }
    };

    if (contextLoading) {
        return <div className="loading-container">Loading your profile...</div>;
    }

    if (contextError) {
        return <div className="error-container">Error loading profile: {contextError}. Try refreshing.</div>;
    }

    return (
        <div className="wizard-container">
            <div className="chat-container" ref={chatContainerRef}>
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} text={msg.text} sender={msg.sender} />
                ))}
                {showSummary && (
                    <div className="profile-summary-container">
                        <div className="profile-summary-content">
                            {profileSummary.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showChatInputArea && (
                <div className="chat-input-area">
                    <input
                        ref={userInputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={inputDisabled}
                        placeholder={
                            inputDisabled
                                ? "Please wait..."
                                : conversationState === 'FREE_FORM_CHAT'
                                    ? "Tell me about your learning goals, background, preferences..."
                                    : "Type your response..."
                        }
                    />
                    <button
                        onClick={handleSend}
                        disabled={inputDisabled}
                    >
                        Send
                    </button>
                </div>
            )}

            {showFinalizeBtn && (
                <div className="wizard-action-buttons">
                    <button
                        onClick={handleFinalize}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Saving..." : "Start Learning Journey"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;