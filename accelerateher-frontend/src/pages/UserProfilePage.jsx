// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import { GoogleGenAI } from '@google/genai';

const ChatMessage = ({ text, sender, isTyping = false }) => (
    <div className={`chat-message ${sender}`}>
        {isTyping ? <span className="typing-indicator">●●●</span> : text}
    </div>
);

const UserProfilePage = () => {
    const { userProfile: initialProfileData, saveUserProfile, loading: contextLoading, error: contextError, currentUserId } = useUserProfile();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const userInputRef = useRef(null);
    const hasInitialized = useRef(false);
    const profileCreationStarted = useRef(false);

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [conversationState, setConversationState] = useState('GREETING');
    const [inputDisabled, setInputDisabled] = useState(true);
    const [showFinalizeBtn, setShowFinalizeBtn] = useState(false);
    const [showChatInputArea, setShowChatInputArea] = useState(true);
    const [profileSummary, setProfileSummary] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [profileCreationComplete, setProfileCreationComplete] = useState(false);
    const [showActionButtons, setShowActionButtons] = useState(false);
    const [extractedProfile, setExtractedProfile] = useState({
        userName: '',
        futureSkills: '',
        currentSkills: '',
        preferredLearningStyle: '',
        timeCommitment: '',
        learningPreferences: '',
        endGoalMotivation: '',
        notificationsPreference: ''
    });

    // Gemini API configuration using Google GenAI SDK
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    const isAIEnabled = GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE';

    // Initialize Google GenAI client following official documentation pattern
    const ai = useRef(null);
    const chat = useRef(null);

    useEffect(() => {
        if (isAIEnabled) {
            try {
                ai.current = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

                // Initialize chat with system context
                chat.current = ai.current.chats.create({
                    model: "gemini-2.0-flash",
                    history: [
                        {
                            role: "user",
                            parts: [{ text: "You are a friendly learning platform assistant helping users create their personalized learning profile. Your goal is to have natural, engaging conversations, gather information about the user's learning goals, background, preferences, and motivations, ask follow-up questions to get complete information, and be encouraging and supportive. Keep responses conversational and friendly (1-3 sentences max)." }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Hi! I'm your AI learning assistant. I'm here to help you create a personalized learning profile! 🚀 Instead of filling out a boring form, let's just have a conversation! Tell me about yourself and what you'd like to learn." }],
                        },
                    ],
                });
            } catch (error) {
                console.error('Failed to initialize Google GenAI:', error);
            }
        }
    }, [GEMINI_API_KEY, isAIEnabled]);

    const addMessage = useCallback((text, sender) => {
        setMessages(prev => [...prev, { text, sender, timestamp: Date.now() }]);
    }, []);

    const delay = useCallback((ms) => new Promise(resolve => setTimeout(resolve, ms)), []);

    // Call Gemini API using Google GenAI SDK (following official chat pattern)
    const callGeminiAPI = useCallback(async (prompt) => {
        if (!isAIEnabled || !chat.current) {
            // Fallback responses when AI is not configured
            return "I'm sorry, AI features are not configured yet. Please set up your Gemini API key.";
        }

        try {
            const response = await chat.current.sendMessage({
                message: prompt
            });

            return response.text || "I'm sorry, I couldn't process that.";
        } catch (error) {
            console.error('Gemini API error:', error);
            return "I'm experiencing some technical difficulties. Let me try a different approach.";
        }
    }, [isAIEnabled]);

    // Fallback profile extraction for when AI is not available
    const extractProfileBasic = useCallback((userMessages) => {
        const allText = userMessages.join(' ').toLowerCase();
        const extracted = {};

        // Simple pattern matching - basic fallback
        const nameMatch = allText.match(/(?:i'm|i am|my name is|call me)\s+([a-zA-Z]+)/i);
        if (nameMatch) extracted.userName = nameMatch[1];

        const skillKeywords = ['python', 'javascript', 'java', 'react', 'cloud', 'aws', 'azure', 'data science'];
        skillKeywords.forEach(skill => {
            if (allText.includes(skill)) {
                if (!extracted.futureSkills) extracted.futureSkills = '';
                if (!extracted.futureSkills.includes(skill)) {
                    extracted.futureSkills += (extracted.futureSkills ? ', ' : '') + skill;
                }
            }
        });

        return extracted;
    }, []);

    // Extract profile information using AI or fallback
    const extractProfileWithAI = useCallback(async (conversationText) => {
        if (!isAIEnabled) {
            // Use basic extraction if AI is not available
            const messages = conversationText.split('\n').filter(line => line.trim());
            return extractProfileBasic(messages);
        }

        const extractionPrompt = `
You are an AI assistant helping to extract user profile information from a conversation about learning preferences. 

Based on the following conversation, extract the following information and return it in JSON format:
- userName: User's name or preferred nickname
- futureSkills: What they want to learn (technologies, skills)
- currentSkills: Their current technical background
- preferredLearningStyle: How they like to learn (videos, hands-on, reading, etc.)
- timeCommitment: How much time they can dedicate per week
- learningPreferences: Types of activities they prefer (coding exercises, projects, etc.)
- endGoalMotivation: Their ultimate goal (career change, promotion, etc.)
- notificationsPreference: Whether they want email notifications (Yes/No)

Conversation:
${conversationText}

Return only valid JSON with the extracted information. If information is not mentioned, use empty string "". Be concise but capture the essence of what the user said.

JSON:`;

        try {
            const response = await callGeminiAPI(extractionPrompt);
            // Try to parse JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const extracted = JSON.parse(jsonMatch[0]);
                return extracted;
            }
        } catch (error) {
            console.error('Profile extraction error:', error);
        }

        // Fallback: return empty profile
        return {
            userName: '',
            futureSkills: '',
            currentSkills: '',
            preferredLearningStyle: '',
            timeCommitment: '',
            learningPreferences: '',
            endGoalMotivation: '',
            notificationsPreference: ''
        };
    }, [callGeminiAPI, isAIEnabled, extractProfileBasic]);

    // Generate AI response with fallback
    const generateAIResponse = useCallback(async (userMessage, context = '') => {
        if (!isAIEnabled) {
            // Simple fallback responses
            const responses = [
                "Thank you for sharing that! Tell me more about your learning goals.",
                "Interesting! What else would you like me to know about your background?",
                "That's great! Any specific technologies or skills you want to focus on?",
                "I'm getting a good picture. What's your ultimate goal with this learning?",
                "Perfect! When you're ready, type 'create my profile' to proceed."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        const systemPrompt = `
You are a friendly learning platform assistant helping users create their personalized learning profile. Your goal is to:

1. Have natural, engaging conversations
2. Gather information about the user's learning goals, background, preferences, and motivations
3. Ask follow-up questions to get complete information
4. Be encouraging and supportive

Current conversation context: ${context}

User just said: "${userMessage}"

Current extracted profile information:
- Display Name: ${extractedProfile.userName || 'not provided'}
- Learning Goals: ${extractedProfile.futureSkills || 'not provided'}
- Current Skills: ${extractedProfile.currentSkills || 'not provided'}
- Learning Style: ${extractedProfile.preferredLearningStyle || 'not provided'}
- Time Commitment: ${extractedProfile.timeCommitment || 'not provided'}
- Learning Preferences: ${extractedProfile.learningPreferences || 'not provided'}
- Goals/Motivation: ${extractedProfile.endGoalMotivation || 'not provided'}
- Notifications: ${extractedProfile.notificationsPreference || 'not provided'}

Guidelines:
- Keep responses conversational and friendly
- Ask follow-up questions if information is missing
- If you have enough information, suggest moving to create their learning path
- Be encouraging and personalize responses to what they've shared
- Keep responses concise (1-3 sentences max)

Respond naturally:`;

        return await callGeminiAPI(systemPrompt);
    }, [callGeminiAPI, extractedProfile, isAIEnabled]);

    // Generate learning path using AI with fallback
    const generateLearningPath = useCallback(async (profileData) => {
        if (!isAIEnabled) {
            // Simple fallback path generation
            const goal = profileData.futureSkills?.toLowerCase() || "";
            if (goal.includes("python")) {
                return "🐍 Python Learning Path: Start with Python Fundamentals → Data Structures → Projects";
            } else if (goal.includes("cloud")) {
                return "☁️ Cloud Computing Path: Cloud Concepts → AWS/Azure Basics → Advanced Services";
            } else {
                return "🚀 General Tech Path: Foundation Courses → Specialized Skills → Real Projects";
            }
        }

        const pathPrompt = `
You are an expert learning path designer. Based on the user's profile, create a personalized learning recommendation.

User Profile:
- Display Name: ${profileData.userName}
- Learning Goals: ${profileData.futureSkills}
- Current Skills: ${profileData.currentSkills}
- Learning Style: ${profileData.preferredLearningStyle}
- Time Commitment: ${profileData.timeCommitment}
- Learning Preferences: ${profileData.learningPreferences}
- Goals/Motivation: ${profileData.endGoalMotivation}

Create a personalized learning path that includes:
1. A recommended starting course/module
2. 2-3 follow-up courses in logical order
3. Estimated timeline based on their time commitment
4. Specific learning resources that match their style
5. Motivational message tied to their goals

Format as a clear, encouraging summary that feels personalized to them.`;

        return await callGeminiAPI(pathPrompt);
    }, [callGeminiAPI, isAIEnabled]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Removed redirect logic - ProtectedRoute handles all routing

    // Initialize conversation
    useEffect(() => {
        // Prevent initialization if we're in the middle of generating a profile or have completed it
        if (conversationState === 'GENERATING_PROFILE' || profileCreationComplete || profileCreationStarted.current) {
            console.log('Skipping initialization - profile creation already started or in progress');
            return;
        }

        // UserProfilePage should only handle profile creation, not redirects
        // ProtectedRoute handles all routing logic
        console.log('UserProfilePage loaded - letting ProtectedRoute handle routing logic');

        if (!contextLoading && conversationState === 'GREETING' && !hasInitialized.current && !profileCreationComplete) {
            hasInitialized.current = true;
            const initConversation = async () => {
                setInputDisabled(true);
                await delay(500);

                if (isAIEnabled) {
                    addMessage("Hi! I'm your AI learning assistant. I'm here to help you create a personalized learning profile! 🚀", 'ai');
                    await delay(1200);
                    addMessage("Instead of filling out a boring form, let's just have a conversation! Tell me about yourself and what you'd like to learn.", 'ai');
                    await delay(800);
                    addMessage("I can help with anything - your background, learning goals, preferred style, or just ask me any questions you have!", 'ai');
                } else {
                    addMessage("Hi! Welcome to your learning profile setup! 👋", 'ai');
                    await delay(1200);
                    addMessage("I'll help you create your profile. Since AI features aren't configured, let's chat and I'll extract what I can from our conversation.", 'ai');
                    await delay(800);
                    addMessage("Tell me about your learning goals, background, and what you'd like to achieve!", 'ai');
                }

                setConversationState('CHATTING');
                setInputDisabled(false);
                if (userInputRef.current) {
                    userInputRef.current.focus();
                }
            };
            initConversation();
        }
    }, [contextLoading, conversationState, addMessage, delay, isAIEnabled, profileCreationComplete]);

    // Handle user input
    const handleSend = useCallback(async () => {
        if (inputDisabled || !userInput.trim()) return;

        const userMessage = userInput.trim();
        const lastAiMessage = messages.length > 0 ? messages[messages.length - 1].text.toLowerCase() : "";

        addMessage(userMessage, 'user');
        setUserInput('');
        setInputDisabled(true);
        setIsTyping(true);

        // Add to conversation history
        const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];
        setConversationHistory(newHistory);

        try {
            // Generate AI response first
            const aiResponse = await generateAIResponse(userMessage, newHistory.map(h => h.content).join('\n'));

            await delay(1000); // Simulate thinking time
            setIsTyping(false);
            addMessage(aiResponse, 'ai');

            // Check if AI is asking if user is ready to generate profile
            const aiAsksIfReady = aiResponse.toLowerCase().includes("ready to see") ||
                aiResponse.toLowerCase().includes("ready to get started") ||
                aiResponse.toLowerCase().includes("ready to start") ||
                aiResponse.toLowerCase().includes("personalized learning path") ||
                aiResponse.toLowerCase().includes("ready to begin") ||
                (aiResponse.toLowerCase().includes("ready") && aiResponse.includes("?"));

            if (aiAsksIfReady) {
                console.log('AI asked if user is ready, showing action buttons');
                setShowActionButtons(true);
                setInputDisabled(true);
                setShowChatInputArea(false);
                return;
            }

            // Extract profile information continuously
            const conversationText = newHistory.map(h => h.content).join('\n');
            const extracted = await extractProfileWithAI(conversationText);
            setExtractedProfile(prev => ({
                ...prev,
                ...extracted
            }));

        } catch (error) {
            console.error('Error handling user input:', error);
            setIsTyping(false);
            addMessage("I'm sorry, I had a technical hiccup. Could you repeat that?", 'ai');
        } finally {
            setInputDisabled(false);
            if (userInputRef.current) {
                userInputRef.current.focus();
            }
        }
    }, [userInput, inputDisabled, conversationHistory, addMessage, delay, generateAIResponse, extractProfileWithAI]);

    // Handle profile generation
    useEffect(() => {
        if (conversationState === 'GENERATING_PROFILE') {
            const generateProfile = async () => {
                setInputDisabled(true);
                setShowChatInputArea(false);

                try {
                    // Final extraction of profile data
                    const conversationText = conversationHistory.map(h => h.content).join('\n');
                    const finalProfile = await extractProfileWithAI(conversationText);
                    setExtractedProfile(finalProfile);

                    await delay(1000);
                    addMessage("Analyzing your learning preferences and goals...", 'ai');

                    await delay(1500);
                    addMessage("Creating your personalized learning path...", 'ai');

                    // Save the profile to the backend
                    const savedProfile = await saveUserProfile(finalProfile);

                    if (savedProfile) {
                        await delay(1000);
                        addMessage("🎉 Perfect! Your personalized learning path has been created and saved!", 'ai');
                        await delay(500);
                        addMessage("You're all set to begin your learning journey. Click the button below to go to your dashboard!", 'ai');
                        setProfileCreationComplete(true);
                    } else {
                        addMessage("I couldn't save your profile right now. Please ensure you are logged in and try again.", 'ai');
                        setShowChatInputArea(true); // Re-enable input for retry
                        setInputDisabled(false);
                    }
                } catch (error) {
                    console.error('Error in profile generation:', error);
                    addMessage("I had trouble creating your profile. Please try again.", 'ai');
                    setShowChatInputArea(true); // Re-enable input for retry
                    setInputDisabled(false);
                }
            };

            generateProfile();
        }
    }, [conversationState, conversationHistory, extractProfileWithAI, saveUserProfile, addMessage, delay]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // This function is now just for navigation
    const goToDashboard = () => {
        console.log('goToDashboard called, navigating to /dashboard');
        navigate('/dashboard');
    };

    // Handle Yes button - generate profile
    const handleGenerateProfile = async () => {
        console.log('User clicked Yes - starting profile generation');
        setShowActionButtons(false);
        profileCreationStarted.current = true;
        addMessage("Perfect! Let me analyze everything you've shared and create your personalized learning profile...", 'ai');
        setConversationState('GENERATING_PROFILE');
    };

    // Handle No button - continue conversation
    const handleContinueConversation = () => {
        console.log('User clicked No - continuing conversation');
        setShowActionButtons(false);
        setInputDisabled(false);
        setShowChatInputArea(true);
        addMessage("No problem! What would you like to tell me more about or change in your learning preferences?", 'ai');
        if (userInputRef.current) {
            userInputRef.current.focus();
        }
    };

    console.log('Current state - profileCreationComplete:', profileCreationComplete, 'conversationState:', conversationState, 'profileCreationStarted:', profileCreationStarted.current);

    if (contextLoading) {
        return <div className="loading-container">Loading your profile...</div>;
    }

    if (contextError) {
        return <div className="error-container">Error loading profile: {contextError}. Try refreshing.</div>;
    }

    // If profile creation was started but component re-rendered, show completion screen
    if (profileCreationStarted.current && !profileCreationComplete) {
        return (
            <div className="wizard-container">
                <div className="chat-container">
                    <div className="chat-message ai">🎉 Your profile has been created! Click below to go to your dashboard.</div>
                </div>
                <div className="wizard-action-buttons">
                    <button onClick={goToDashboard} className="primary-btn">
                        🚀 Go to My Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wizard-container">
            <div className="chat-container" ref={chatContainerRef}>
                {messages.map((msg, idx) => (
                    <ChatMessage key={idx} text={msg.text} sender={msg.sender} />
                ))}
                {isTyping && <ChatMessage text="" sender="ai" isTyping={true} />}

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
                                : "Tell me about your learning goals, ask questions, or say 'create my profile' when ready..."
                        }
                    />
                    <button
                        onClick={handleSend}
                        disabled={inputDisabled || !userInput.trim()}
                    >
                        Send
                    </button>
                </div>
            )}

            {showActionButtons && (
                <div className="wizard-action-buttons">
                    <button
                        onClick={handleGenerateProfile}
                        className="primary-btn"
                        style={{ marginRight: '10px' }}
                    >
                        ✅ Yes, Generate My Learning Path
                    </button>
                    <button
                        onClick={handleContinueConversation}
                        className="secondary-btn"
                    >
                        ❌ No, Let Me Add More Details
                    </button>
                </div>
            )}

            {profileCreationComplete && (
                <div className="wizard-action-buttons">
                    {console.log('Rendering dashboard button because profileCreationComplete is true')}
                    <button
                        onClick={goToDashboard}
                        className="primary-btn"
                    >
                        🚀 Go to My Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;