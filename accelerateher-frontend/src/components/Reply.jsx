import React from 'react';
import PropTypes from 'prop-types';

const Reply = ({ reply }) => {
    // A simple formatter for dates, can be expanded
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="reply-item">
            <div className="reply-header">
                <strong className="reply-author">{reply.author_username || 'Anonymous'}</strong>
                <span className="reply-date">{formatDate(reply.created_at)}</span>
            </div>
            <p className="reply-content">{reply.content}</p>
        </div>
    );
};

Reply.propTypes = {
    reply: PropTypes.shape({
        author_username: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
    }).isRequired,
};

export default Reply; 