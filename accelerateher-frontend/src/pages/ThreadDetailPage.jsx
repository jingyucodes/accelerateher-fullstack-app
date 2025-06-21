import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Reply from '../components/Reply';
import { useAuth } from '../contexts/AuthContext';

const ThreadDetailPage = () => {
    const { threadId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReplyContent, setNewReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchThreadAndReplies = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('authToken');

                // Fetch the main thread details
                const threadRes = await fetch(`http://localhost:8000/api/forum/thread/${threadId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!threadRes.ok) throw new Error('Failed to fetch thread.');
                const threadData = await threadRes.json();
                setThread(threadData);

                // Fetch the replies for the thread
                const repliesRes = await fetch(`http://localhost:8000/api/forum/thread/${threadId}/replies`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!repliesRes.ok) throw new Error('Failed to fetch replies.');
                const repliesData = await repliesRes.json();
                setReplies(repliesData);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchThreadAndReplies();
    }, [threadId, isAuthenticated, navigate]);

    const handlePostReply = async () => {
        if (!newReplyContent.trim()) {
            alert('Reply content cannot be empty.');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8000/api/forum/thread/${threadId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newReplyContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to post reply.');
            }

            const newReply = await response.json();
            setReplies(prevReplies => [...prevReplies, newReply]);
            setNewReplyContent(''); // Clear textarea after successful post

        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (isLoading) return (
        <>
            <Header pageTitle="Forum Thread" showDashboardButton={true} />
            <div className="loading-container">Loading thread...</div>
        </>
    );

    if (error) return (
        <>
            <Header pageTitle="Forum Thread" showDashboardButton={true} />
            <div className="error-container">Error: {error}</div>
        </>
    );

    if (!thread) return (
        <>
            <Header pageTitle="Forum Thread" showDashboardButton={true} />
            <div className="error-container">Thread not found.</div>
        </>
    );

    return (
        <>
            <Header pageTitle="Forum Thread" showDashboardButton={true} />

            {/* Navigation Bar */}
            <div className="thread-nav-bar">
                <button
                    className="back-to-forum-btn"
                    onClick={() => navigate('/forum')}
                >
                    ← Back to Forum
                </button>
                <div className="thread-nav-info">
                    <span>General Discussion</span>
                </div>
            </div>

            <div className="thread-detail-container">
                {/* Original Post */}
                <div className="original-post">
                    <div className="post-header">
                        <div className="post-author-info">
                            <div className="avatar-circle">{thread.author_username.charAt(0).toUpperCase()}</div>
                            <div className="author-details">
                                <h3 className="author-name">{thread.author_username}</h3>
                                <span className="post-date">{formatDate(thread.created_at)}</span>
                            </div>
                        </div>
                        <div className="post-actions">
                            <span className="post-number">#1</span>
                        </div>
                    </div>
                    <div className="post-content">
                        <h2 className="thread-title">{thread.title}</h2>
                        <div className="post-body">
                            {thread.content}
                        </div>
                    </div>
                </div>

                {/* Replies Section */}
                <div className="replies-section">
                    <div className="replies-header">
                        <h3>Replies ({replies.length})</h3>
                    </div>

                    <div className="replies-list">
                        {replies.length > 0 ? (
                            replies.map((reply, index) => (
                                <div key={reply.id || reply._id} className="reply-post">
                                    <div className="post-header">
                                        <div className="post-author-info">
                                            <div className="avatar-circle">{reply.author_username.charAt(0).toUpperCase()}</div>
                                            <div className="author-details">
                                                <h4 className="author-name">{reply.author_username}</h4>
                                                <span className="post-date">{formatDate(reply.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="post-actions">
                                            <span className="post-number">#{index + 2}</span>
                                        </div>
                                    </div>
                                    <div className="post-content">
                                        <div className="post-body">
                                            {reply.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-replies">
                                <p>No replies yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply Form */}
                <div className="reply-form-section">
                    <div className="reply-form-header">
                        <h3>Post a Reply</h3>
                    </div>
                    <div className="reply-form">
                        <textarea
                            rows="6"
                            value={newReplyContent}
                            onChange={(e) => setNewReplyContent(e.target.value)}
                            placeholder="Write your reply here..."
                            className="reply-textarea"
                        />
                        <div className="reply-form-actions">
                            <button
                                onClick={handlePostReply}
                                className="primary-btn"
                            >
                                Submit Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThreadDetailPage; 