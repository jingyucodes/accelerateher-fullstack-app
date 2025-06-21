import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const ForumPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [topics, setTopics] = useState([]);
    const [threads, setThreads] = useState([]);
    const [activeTopicId, setActiveTopicId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [showNewThreadForm, setShowNewThreadForm] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchTopics = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:8000/api/forum/topics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch topics.');
                const data = await response.json();
                setTopics(data);
                if (data.length > 0) {
                    setActiveTopicId(data[0].id); // Set the first topic as active
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchTopics();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!activeTopicId || !isAuthenticated) return;

        const fetchThreads = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8000/api/forum/threads/${activeTopicId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error(`Failed to fetch threads for ${activeTopicId}.`);
                const data = await response.json();
                setThreads(data);
            } catch (err) {
                setError(err.message);
                setThreads([]); // Clear threads on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchThreads();
    }, [activeTopicId, isAuthenticated]);

    const activeTopicName = topics.find(t => t.id === activeTopicId)?.name || '';

    const handleTopicClick = (topicId) => {
        setActiveTopicId(topicId);
        setShowNewThreadForm(false);
    };

    const handleCreateNewThread = () => {
        setShowNewThreadForm(prev => !prev);
    };

    const handleSubmitThread = async () => {
        if (!newThreadTitle.trim() || !newThreadContent.trim()) {
            alert('Please enter both a title and content.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            console.log('Token being used:', token ? 'Token exists' : 'No token found');
            console.log('Token length:', token ? token.length : 0);

            const response = await fetch('http://localhost:8000/api/forum/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    topic_id: activeTopicId,
                    title: newThreadTitle,
                    content: newThreadContent
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.text();
                console.log('Error response:', errorData);
                throw new Error(`Failed to post new thread: ${response.status} - ${errorData}`);
            }

            const newThread = await response.json();
            setThreads(prevThreads => [newThread, ...prevThreads]);

            // Reset form
            setShowNewThreadForm(false);
            setNewThreadTitle('');
            setNewThreadContent('');
            alert('New thread posted successfully!');

        } catch (err) {
            console.error('Full error:', err);
            setError(err.message);
            alert(`Error: ${err.message}`);
        }
    };

    const handleThreadClick = (threadId) => {
        navigate(`/forum/thread/${threadId}`);
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
                            <input
                                type="text"
                                value={newThreadTitle}
                                onChange={(e) => setNewThreadTitle(e.target.value)}
                                placeholder="Enter a descriptive title"
                            />
                            <textarea
                                rows="4"
                                value={newThreadContent}
                                onChange={(e) => setNewThreadContent(e.target.value)}
                                placeholder="Share your thoughts or questions..."
                            />
                            <div>
                                <button type="button" onClick={handleSubmitThread}>Post Thread</button>
                                <button type="button" className="secondary" onClick={() => setShowNewThreadForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    <div className="thread-list-container">
                        {isLoading ? (
                            <p>Loading threads...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>Error: {error}</p>
                        ) : (
                            <ul className="thread-list">
                                {threads.length > 0 ? (
                                    threads.map(thread => (
                                        <li
                                            key={thread.id || thread._id}
                                            className="thread-item"
                                            onClick={() => handleThreadClick(thread.id || thread._id)}
                                        >
                                            <h3>{thread.title}</h3>
                                            <div className="thread-meta">
                                                <span>By: {thread.author_username}</span>
                                                <span>Replies: {thread.reply_count}</span>
                                                <span>Last Post: {new Date(thread.last_activity_at).toLocaleString()}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="thread-item" style={{ textAlign: 'center', color: '#777' }}>No threads in this topic yet.</li>
                                )}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ForumPage;