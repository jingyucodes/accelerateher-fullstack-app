import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { forumDataStore as initialForumData } from '../data/mockData'; // renamed for clarity

const ForumPage = () => {
    const navigate = useNavigate();
    const [forumData, setForumData] = useState(initialForumData);
    const [topics] = useState([
        { id: "general", name: "# General Discussion" },
        { id: "python", name: "# Python Help" },
        { id: "data-analysis", name: "# Data Analysis" },
        { id: "web-dev", name: "# Web Development" },
        { id: "cloud", name: "# Cloud Computing" },
        { id: "career", name: "# Career Advice" },
        { id: "feedback", name: "# Platform Feedback" },
    ]);
    const [activeTopicId, setActiveTopicId] = useState('general');
    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');

    const activeTopicName = topics.find(t => t.id === activeTopicId)?.name || '';
    const threadsForActiveTopic = forumData[activeTopicId] || [];

    const handleTopicClick = (topicId) => {
        setActiveTopicId(topicId);
        setShowNewThreadForm(false); // Hide form when switching topics
    };

    const handleCreateNewThread = () => {
        setShowNewThreadForm(prev => !prev);
    };

    const handleSubmitThread = () => {
        if (!newThreadTitle.trim() || !newThreadContent.trim()) {
            alert('Please enter both a title and content.');
            return;
        }
        const newThread = {
            id: `${activeTopicId}-${Date.now()}`,
            title: newThreadTitle,
            author: "CurrentUser", // Would come from userProfile in context
            replies: 0,
            lastPost: "Just now",
            content: newThreadContent
        };
        setForumData(prevData => ({
            ...prevData,
            [activeTopicId]: [newThread, ...(prevData[activeTopicId] || [])]
        }));
        setShowNewThreadForm(false);
        setNewThreadTitle('');
        setNewThreadContent('');
        alert('New thread posted! (Simulated)');
    };

    return (
        <>
            <Header pageTitle="TechPath Community Forum" showDashboardButton={true} />
            <div className="forum-layout">
                <aside className="topic-sidebar">
                    <h2>Topics / Channels</h2>
                    <ul className="topic-list">
                        {topics.map(topic => (
                            <li 
                                key={topic.id} 
                                className={activeTopicId === topic.id ? 'active' : ''}
                                onClick={() => handleTopicClick(topic.id)}
                            >
                                {topic.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="thread-main">
                    <div className="thread-header">
                        <h2>{activeTopicName}</h2>
                        <button onClick={handleCreateNewThread}>Create New Thread</button>
                    </div>

                    {showNewThreadForm && (
                        <div className="new-thread-form">
                            <h3>Start a New Thread in <span >{activeTopicName.substring(2)}</span></h3>
                            <label htmlFor="thread-title">Title:</label>
                            <input 
                                type="text" 
                                id="thread-title"
                                value={newThreadTitle} 
                                onChange={(e) => setNewThreadTitle(e.target.value)}
                                placeholder="Enter a descriptive title"
                            />
                            <label htmlFor="thread-content">Your post:</label>
                            <textarea 
                                id="thread-content" 
                                rows="4" 
                                value={newThreadContent}
                                onChange={(e) => setNewThreadContent(e.target.value)}
                                placeholder="Share your thoughts or questions..."
                            />
                            <div>
                                <button type="button" className="btn" onClick={handleSubmitThread}>Post Thread</button>
                                <button type="button" className="btn secondary" onClick={() => setShowNewThreadForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="thread-list-container">
                        <ul className="thread-list">
                            {threadsForActiveTopic.length > 0 ? (
                                threadsForActiveTopic.map(thread => (
                                    <li 
                                        key={thread.id} 
                                        className="thread-item"
                                        onClick={() => alert(`Viewing thread: "${thread.title}"\n\nContent: "${thread.content || 'No content.'}"\n\n(Full view TBD.)`)}
                                    >
                                        <h3>{thread.title}</h3>
                                        <div className="thread-meta">
                                            <span>By: {thread.author}</span>
                                            <span>Replies: {thread.replies}</span>
                                            <span>Last Post: {thread.lastPost}</span>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="thread-item" style={{textAlign:'center', color:'#777'}}>No threads in this topic yet.</li>
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ForumPage;