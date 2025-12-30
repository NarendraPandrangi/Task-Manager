import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Comments.css';

export default function Comments({ issueId, currentUser, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        if (!issueId) return;

        const q = query(
            collection(db, 'issues', issueId, 'comments'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsData);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [issueId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'issues', issueId, 'comments'), {
                text: newComment,
                author: currentUser.email,
                createdAt: serverTimestamp(),
            });
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment: ", error);
            alert("Failed to send comment");
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        // Handle Firestore Timestamp or Date object
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comments-modal-overlay">
            <div className="comments-modal">
                <div className="comments-header">
                    <h3>Comments</h3>
                    <button onClick={onClose} className="btn-close-comments">×</button>
                </div>

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <div className="no-comments">No comments yet. Be the first to start the discussion!</div>
                    ) : (
                        comments.map(comment => (
                            <div
                                key={comment.id}
                                className={`comment-item ${comment.author === currentUser.email ? 'own-comment' : ''}`}
                            >
                                <div className="comment-avatar">
                                    {comment.author && comment.author[0].toUpperCase()}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-meta">
                                        <span className="comment-author">
                                            {comment.author === currentUser.email ? 'You' : comment.author}
                                        </span>
                                        <span className="comment-time">{formatTime(comment.createdAt)}</span>
                                    </div>
                                    <div className="comment-text">{comment.text}</div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={commentsEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="comment-form">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        disabled={loading}
                    />
                    <button type="submit" disabled={loading || !newComment.trim()}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
