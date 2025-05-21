// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext'; // Ensure this path is correct

const ChatMessage = ({ text, sender }) => (
    <div className={`chat-message ${sender}`}>{text}</div>
);

const UserProfilePage = () => {
    // Use userProfile from context for existing data, saveUserProfile for saving
    const { userProfile: initialProfileData, saveUserProfile, loading: contextLoading, error: contextError, currentUserId } = useUserProfile();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [conversationState, setConversationState] = useState('INITIAL_LOAD'); // Start with initial load
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    // Initialize structuredProfile. If initialProfileData exists, use it, else default.
    const [structuredProfile, setStructuredProfile] = useState({
        name: 'Learner', futureSkills: '', currentSkills: '',
        preferredLearningStyle: '', timeCommitment: '', learningPreferences: '',
        endGoalMotivation: '', notificationsPreference: ''
    });

    const [profileSummary, setProfileSummary] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [showFinalizeBtn, setShowFinalizeBtn] = useState(false);
    const [showPathNowBtn, setShowPathNowBtn] = useState(false);
    const [showChatInputArea, setShowChatInputArea] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // Local processing state for chat flow

    const questions = [ /* ... questions array remains the same ... */
        { key: 'futureSkills', text: "To start, what is your primary learning goal or what new skills are you hoping to acquire? (e.g., career advancement in cloud, learn Python for data analysis, become a full-stack developer)" },
        { key: 'currentSkills', text: "Could you describe your current technical skills or knowledge level, particularly those relevant to your goals? (e.g., Python basics, some SQL knowledge, familiar with AWS S3, complete beginner)" },
        { key: 'preferredLearningStyle', text: "What's your preferred way to learn? (e.g., video tutorials, reading articles, hands-on projects, a mix)" },
        { key: 'timeCommitment', text: "How many hours per week can you realistically dedicate to learning?" },
        { key: 'learningPreferences', text: "Are there specific types of content or activities you find most engaging or helpful? (e.g., industry case studies, coding exercises, live lectures, quick tips, quizzes)" },
        { key: 'endGoalMotivation', text: "What's the ultimate end goal you hope to achieve with this learning, and what's your main motivation? (e.g., get a promotion, build a specific project, career change, personal growth)" },
        { key: 'notificationsPreference', text: "Okay, almost done! Would you like to receive email notifications to remind you about your progress and upcoming tasks? (Yes/No)" }
    ];


    const addMessage = (text, sender) => {
        setMessages(prev => [...prev, { text, sender, timestamp: Date.now() }]);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Functions compileProfileDataForDisplay and suggestLearningPath remain the same
    const compileProfileDataForDisplay = (profile) => { /* ... same ... */
        let output = "--- YOUR PROFILE ---\n";
        output += `Name: ${profile.name || 'Learner'}\n`;
        output += `Learning Goal (Future Skills): ${profile.futureSkills || 'Not specified'}\n`;
        output += `Current Knowledge Level (Current Skills): ${profile.currentSkills || 'Not specified'}\n`;
        output += `Preferred Learning Style: ${profile.preferredLearningStyle || 'Not specified'}\n`;
        output += `Time Commitment: ${profile.timeCommitment || 'Not specified'}\n`;
        output += `Learning Preferences: ${profile.learningPreferences || 'Not specified'}\n`;
        output += `End Goal & Motivation: ${profile.endGoalMotivation || 'Not specified'}\n`;
        output += `Notifications: ${profile.notificationsPreference || 'Not specified'}\n`;
        return output;
    };
    const suggestLearningPath = (profile) => { /* ... same ... */
        let path = "";
        const goal = profile.futureSkills?.toLowerCase() || "";
        if (goal.includes("cloud") || goal.includes("azure") || goal.includes("aws") || goal.includes("gcp")) {
            if (goal.includes("security")) {
                path += "Course to start with: Cloud Security Fundamentals (e.g., AZ-900 Azure Fundamentals then focus on security modules)\n";
                path += "Next suggested course: [Vendor-Specific] Security Associate (e.g., AZ-500, AWS Security Specialty)\n";
            } else {
                path += "Course to start with: Introduction to Cloud Computing (e.g., Cloud Practitioner Essentials / AZ-900)\n";
                path += "Next suggested course: Solutions Architect Associate (AWS) or Azure Administrator (AZ-104)\n";
            }
        } else if (goal.includes("python")) {
            path += "Course to start with: Python for Absolute Beginners\n";
            if (goal.includes("data")) {
                path += "Next suggested course: Data Analysis with Pandas & NumPy\n";
            } else {
                path += "Next suggested course: Object-Oriented Programming in Python\n";
            }
        } else if (goal.includes("web develop")) {
            path += "Course to start with: HTML, CSS, and JavaScript Fundamentals\n";
            path += "Next suggested course: Frontend Framework (e.g., React, Vue) or Backend Development (e.g., Node.js, Python/Django)\n";
        } else {
            path += "Course to start with: Foundational Course in Your Area of Interest.\n";
        }
        if (!path.trim()) {
             path = "We recommend starting with foundational courses related to your learning goal.\n";
        }
        path += "\n(Remember, this is a sample path. Our platform offers many modules!)";
        return path;
    };
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Effect to handle initial loading of profile from context
    useEffect(() => {
        if (conversationState === 'INITIAL_LOAD' && !contextLoading) {
            if (initialProfileData) {
                // Profile exists, populate and go to review
                console.log("Existing profile found in context:", initialProfileData);
                // The backend returns _id, but our Pydantic model on frontend might expect user_id if aliased
                // For structuredProfile, we don't need user_id/ _id as it's managed by context
                const { user_id, _id, ...profileFields } = initialProfileData;
                setStructuredProfile(prev => ({...prev, ...profileFields}));

                const pOutput = compileProfileDataForDisplay(initialProfileData);
                const pSuggest = suggestLearningPath(initialProfileData);
                setProfileSummary(pOutput + "\n\n--- SUGGESTED LEARNING PATH ---\n" + pSuggest);
                setShowSummary(true);
                setConversationState('PATH_REVIEW'); // Go to review state
            } else {
                // No profile exists, start onboarding
                console.log("No existing profile, starting GREETING.");
                setConversationState('GREETING');
            }
        }
    }, [conversationState, contextLoading, initialProfileData]);


    // Effect to manage conversation flow
    useEffect(() => {
        const manageConversation = async () => {
            if (isProcessing || conversationState === 'INITIAL_LOAD') return;
            setIsProcessing(true);
            setInputDisabled(true);
            await delay(300);

            if (conversationState === 'GREETING') {
                addMessage("I'm your Learning Platform Assistant...", 'ai'); // Shortened for brevity
                setConversationState('ASKING_QUESTIONS');
            } else if (conversationState === 'ASKING_QUESTIONS') {
                if (currentQuestionIndex < questions.length) {
                    addMessage(questions[currentQuestionIndex].text, 'ai');
                    setInputDisabled(false);
                    if (currentQuestionIndex > 0) setShowPathNowBtn(true);
                } else {
                    setConversationState('GENERATING_PATH');
                }
            } else if (conversationState === 'GENERATING_PATH') {
                setShowPathNowBtn(false);
                addMessage("Okay, I'll prepare your learning path...", 'ai');
                await delay(1000);
                const pOutput = compileProfileDataForDisplay(structuredProfile);
                const pSuggest = suggestLearningPath(structuredProfile);
                setProfileSummary(pOutput + "\n\n--- SUGGESTED LEARNING PATH ---\n" + pSuggest);
                setShowSummary(true);
                setConversationState('PATH_REVIEW');
            } else if (conversationState === 'PATH_REVIEW') {
                addMessage("Here's your profile summary and a suggested learning path...", 'ai');
                setShowFinalizeBtn(true);
                setShowChatInputArea(false);
                setInputDisabled(true);
            }
            // FINALIZED state is handled by handleFinalize directly
            setIsProcessing(false);
        };
        manageConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationState, currentQuestionIndex]); // Rerun when state or question index changes


    const handleSend = () => {
        const text = userInput.trim();
        if (isProcessing || conversationState !== 'ASKING_QUESTIONS') return;

        if (!text && currentQuestionIndex > 0 && text.toLowerCase() !== 'stop') {
             alert('Please provide an answer or type "stop".');
             return;
        }
        addMessage(text, 'user');
        setUserInput('');

        if (text.toLowerCase() === 'stop') {
            setConversationState('GENERATING_PATH');
            return;
        }
        
        // Special handling for user asking a question
        if (text.includes('?') && text.length > 10 && !text.toLowerCase().startsWith("yes") && !text.toLowerCase().startsWith("no")) {
            addMessage("That's an interesting question! For now, let's focus on building your profile. So, regarding the previous question...", 'ai');
            // Re-trigger asking the same question by just setting state without advancing index
            // The useEffect will pick up the 'ASKING_QUESTIONS' state and re-render the current question
            setConversationState('ASKING_QUESTIONS_REPROMPT'); // Temporary state to force re-render
            setTimeout(() => setConversationState('ASKING_QUESTIONS'), 50); // Then back to normal
            return; 
       }


        const currentQ = questions[currentQuestionIndex];
        if (currentQ) {
            setStructuredProfile(prev => ({ ...prev, [currentQ.key]: text }));
        }
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handleKeyPress = (e) => { /* ... same ... */
        if (e.key === 'Enter' && !inputDisabled && !isProcessing) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const handleShowPathNow = () => { /* ... same ... */
        if (isProcessing) return;
        setConversationState('GENERATING_PATH');
    };

    const handleFinalize = async (e) => {
        e.preventDefault();
        if (isProcessing) return;
        setIsProcessing(true); // To disable button during save

        if (!structuredProfile.futureSkills && !structuredProfile.currentSkills) {
             if(!window.confirm("Your profile seems quite empty. Are you sure you want to proceed?")){
                 setIsProcessing(false);
                 return;
             }
        }
        
        const profileToSave = { ...structuredProfile };
        // user_id (currentUserId) is handled by saveUserProfile context function

        const savedProfile = await saveUserProfile(profileToSave);

        if (savedProfile) {
            addMessage("Your profile has been saved! Redirecting to dashboard...", "ai");
            await delay(1500);
            navigate('/dashboard');
        } else {
            addMessage("There was an error saving your profile. Please try again.", "ai");
            // Optionally, re-enable finalize button or provide more specific error
        }
        setIsProcessing(false);
    };

    if (contextLoading && conversationState === 'INITIAL_LOAD') {
        return <div>Loading your profile...</div>;
    }
    if (contextError && conversationState === 'INITIAL_LOAD') {
        return <div>Error loading profile: {contextError}. Try refreshing.</div>;
    }

    return (
        <div className="wizard-container">
            <h1>{initialProfileData ? "Edit Your Learning Profile" : "Create Your Learning Profile"}</h1>
            <form onSubmit={handleFinalize}>
                <div id="chat-container" ref={chatContainerRef}>
                    {messages.map((msg) => (
                        <ChatMessage key={msg.timestamp + msg.sender + msg.text.slice(0,5)} text={msg.text} sender={msg.sender} />
                    ))}
                </div>

                {showChatInputArea && (
                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your response, or 'stop'..."
                            disabled={inputDisabled || isProcessing}
                            autoComplete="off"
                        />
                        <button type="button" onClick={handleSend} disabled={inputDisabled || isProcessing} className="btn">Send</button>
                    </div>
                )}

                {showSummary && (
                    <div className="profile-summary-container">
                        <h2>Your Profile & Suggested Path</h2>
                        <div className="profile-summary-content" style={{whiteSpace: 'pre-wrap'}}>{profileSummary}</div>
                    </div>
                )}
                
                <div className="wizard-action-buttons">
                    {showPathNowBtn && (
                         <button type="button" onClick={handleShowPathNow} className="btn secondary" disabled={isProcessing}>Show My Path Now</button>
                    )}
                    {showFinalizeBtn && (
                        <button type="submit" className="btn" disabled={isProcessing || contextLoading}>
                            {contextLoading ? "Saving..." : (initialProfileData ? "Update Profile & Go to Dashboard" : "Finalize Profile & Go to Dashboard")}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UserProfilePage;