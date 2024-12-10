import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import './global.css';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';

interface Feedback {
  feedback_id: string;
  note_content: string;
  class: string;
  instructor_name: string;
  createdAt: string;
}

interface Comment {
  comment_id: string;
  author_name: string;
  content: string;
  createdAt: string;
}

const GolferFeedbackManager: React.FC = () => {
  const { golfer_id } = useParams<{ golfer_id: string }>();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedFeedback, setExpandedFeedback] = useState<Feedback | null>(null);
  const [commentContent, setCommentContent] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await instance.get(`/feedback/${golfer_id}`, { withCredentials: true });
        if (response.data.success) {
          setFeedbacks(
            response.data.feedbacks.sort(
              (a: Feedback, b: Feedback) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setMessage('Failed to load feedback. Please try again.');
      }
    };

    fetchFeedbacks();
  }, [golfer_id]);

  const fetchComments = async (feedbackId: string) => {
    try {
      const response = await instance.get(`/comment/${feedbackId}`, { withCredentials: true });
      if (response.data.success) {
        setComments(response.data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      setMessage('Comment content cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.post(
        '/comment/new',
        { feedback_id: expandedFeedback?.feedback_id, content: commentContent, author_id: golfer_id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setComments((prev) => [...prev, response.data.comment]);
        setCommentContent('');
        setMessage('Comment added successfully.');
      } else {
        setMessage('Failed to add comment.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setMessage('An error occurred while adding the comment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await instance.delete(`/comment/${commentId}`, { withCredentials: true });
      if (response.data.success) {
        setComments((prev) => prev.filter((comment) => comment.comment_id !== commentId));
        setMessage('Comment deleted successfully.');
      } else {
        setMessage('Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setMessage('An error occurred while deleting the comment.');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.comment_id);
    setCommentContent(comment.content);
  };

  const handleSaveComment = async () => {
    if (!commentContent.trim()) {
      setMessage('Comment content cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.put(
        `/comment/${editingCommentId}`,
        { content: commentContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.comment_id === editingCommentId ? { ...comment, content: commentContent } : comment
          )
        );
        setMessage('Comment updated successfully.');
        setEditingCommentId(null);
        setCommentContent('');
      } else {
        setMessage('Failed to update comment.');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      setMessage('An error occurred while updating the comment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setCommentContent('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h2 className="dropdown-header" style={{ marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
        Your Feedback ({feedbacks.length})
      </h2>
      {message && <p style={{ color: 'red', margin: '1rem 0' }}>{message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {feedbacks.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback.feedback_id}
              style={{
                padding: '1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                marginBottom: '1rem',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
              onClick={() => {
                setExpandedFeedback(feedback);
                fetchComments(feedback.feedback_id);
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fafff2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <p style={{ fontSize: '1rem', color: '#1F2937' }}>
                Feedback on <strong>{feedback.class}</strong> by{' '}
                <span style={{ color: '#0e5f04' }}>{feedback.instructor_name}</span> on{' '}
                {new Date(feedback.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {expandedFeedback && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <button 
              onClick={() => {setExpandedFeedback(null); setCommentContent('')}} 
              className="close-btn"
            >
              ×
            </button>
            
            <div className="feedback-header">
              <h2>{expandedFeedback.class}</h2>
            </div>

            <div className="feedback-meta">
              <p><strong>Instructor:</strong> {expandedFeedback.instructor_name}</p>
              <p><strong>Date:</strong> {new Date(expandedFeedback.createdAt).toLocaleString()}</p>
            </div>

            <div className="feedback-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(expandedFeedback.note_content),
                }}
              />
            </div>

            <div className="comments-section">
              <h3 className="comments-header">Comments</h3>
              
              {editingCommentId === null && (
                <div className="comment-box">
                  <ReactQuill
                    className="quill-editor"
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={(value) => setCommentContent(DOMPurify.sanitize(value.trim()))}
                  />
                  <button 
                    className="action-btn submit-btn"
                    onClick={handleAddComment} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Comment'}
                  </button>
                </div>
              )}

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.comment_id} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-author">{comment.author_name}</span>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>

                    {editingCommentId === comment.comment_id ? (
                      <div>
                        <ReactQuill
                          className="quill-editor"
                          value={commentContent}
                          onChange={(value) => setCommentContent(DOMPurify.sanitize(value.trim()))}
                        />
                        <div className="comment-actions">
                          <button 
                            className="action-btn submit-btn"
                            onClick={handleSaveComment} 
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            className="action-btn cancel-btn"
                            onClick={handleCancelEditComment}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.content),
                          }}
                        />
                        <div className="comment-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditComment(comment)}
                          >
                            Edit
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteComment(comment.comment_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GolferFeedbackManager;
