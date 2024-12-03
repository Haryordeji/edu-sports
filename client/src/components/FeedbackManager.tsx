import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import instance from '../utils/axios';
import './global.css';
import { AxiosResponse } from 'axios';

interface Feedback {
  feedback_id: string;
  note_content: string;
  class: string;
  instructor_name: string;
  createdAt: string;
}

interface Event {
  class_id: string;
  title: string;
}

const FeedbackManager: React.FC = () => {
  const { instructor_id, golfer_id } = useParams<{ instructor_id: string; golfer_id: string }>();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [classes, setClasses] = useState<Event[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [expandedFeedback, setExpandedFeedback] = useState<Feedback | null>(null);
  const [isAddingOrEditing, setIsAddingOrEditing] = useState<boolean>(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackResponse, classesResponse] = await Promise.all([
          instance.get(`/feedback/${golfer_id}`, { withCredentials: true }),
          instance.get(`/classes`, { withCredentials: true }),
        ]);
        if (feedbackResponse.data.success) {
          const sortedFeedbacks = feedbackResponse.data.feedbacks.sort(
            (a: Feedback, b: Feedback) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setFeedbacks(sortedFeedbacks);
        }
        if (classesResponse.data.success) setClasses(classesResponse.data.classes);
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage('Failed to load data. Please try again.');
      }
    };

    fetchData();
    fetchUserFullName();
  }, [golfer_id]);

  const handleSaveFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClass || !noteContent) {
      setMessage('Please select a class and enter feedback content.');
      return;
    }

    setIsLoading(true);
    try {
      let response: AxiosResponse<any, any>;
      if (editingFeedbackId) {
        response = await instance.put(
          `/feedback/${editingFeedbackId}`,
          { note_content: noteContent, class_id: selectedClass },
          { withCredentials: true }
        );
        if (response.data.success) {
          setFeedbacks((prev) =>
            prev.map((fb) =>
              fb.feedback_id === editingFeedbackId
                ? {
                    ...fb,
                    note_content: noteContent,
                    class: classes.find((cls) => cls.class_id === selectedClass)?.title || fb.class,
                  }
                : fb
            )
          );
          setMessage('Feedback updated successfully!');
        }
      } else {
        response = await instance.post(
          `/feedback/new`,
          { instructor_id, golfer_id, class_id: selectedClass, note_content: noteContent },
          { withCredentials: true }
        );
        if (response.data.success) {
          const newFeedback = response.data.feedback;
          setFeedbacks((prev) => [newFeedback, ...prev]);
          setMessage('Feedback submitted successfully!');
        }
      }

      if (response.data.success) {
        setSelectedClass('');
        setNoteContent('');
        setEditingFeedbackId(null);
        setIsAddingOrEditing(false);
      } else {
        setMessage('Failed to save feedback.');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      setMessage('An error occurred while saving feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserFullName = async () => {
    try {
      const response = await instance.get(`/users/name/${golfer_id}`);
      if (response.data && response.data.success) {
        setFullName(response.data.name);
      } else {
        setFullName('Unknown');
      }
    } catch (err) {
      console.error('Error fetching user full name:', err);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      const response = await instance.delete(`/feedback/${feedbackId}`, { withCredentials: true });
      if (response.data.success) {
        setFeedbacks((prev) => prev.filter((fb) => fb.feedback_id !== feedbackId));
        setMessage('Feedback deleted successfully.');
      } else {
        setMessage('Failed to delete feedback.');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setMessage('An error occurred while deleting feedback.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} style={styles.button}>
          ← Back
        </button>
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>{fullName}'s Feedback</h2>
      {message && <p style={{ color: 'red', margin: '1rem 0' }}>{message}</p>}
      <button
        onClick={() => {
          setIsAddingOrEditing(true);
          setEditingFeedbackId(null);
          setSelectedClass('');
          setNoteContent('');
        }}
        style={{ ...styles.button, backgroundColor: '#2563EB', color: '#fff', marginTop: '1rem' }}
      >
        Add New Feedback
      </button>
      <div style={{ marginTop: '1rem' }}>
        {feedbacks.length === 0 ? (
          <p>No feedback found for student</p>
        ) : (
          feedbacks.map((feedback) => (
            <div
              key={feedback.feedback_id}
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => setExpandedFeedback(feedback)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)')
              }
            >
              <p>
                Feedback on <strong>{feedback.class}</strong> by {feedback.instructor_name} on{' '}
                {new Date(feedback.createdAt).toLocaleString()}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingOrEditing(true);
                    setEditingFeedbackId(feedback.feedback_id);
                    setSelectedClass(
                      classes.find((cls) => cls.title === feedback.class)?.class_id || ''
                    );
                    setNoteContent(feedback.note_content);
                  }}
                  style={styles.button}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(feedback.feedback_id);
                  }}
                  style={{ ...styles.button, backgroundColor: '#F87171', color: '#fff' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {expandedFeedback && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={() => setExpandedFeedback(null)} className="back-button">
              ✕
            </button>
            <p>
              <strong>Class:</strong> {expandedFeedback.class}
            </p>
            <p>
              <strong>Instructor:</strong> {expandedFeedback.instructor_name}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(expandedFeedback.createdAt).toLocaleString()}
            </p>
            <p>{expandedFeedback.note_content}</p>
          </div>
        </div>
      )}

      {isAddingOrEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <span
              className="close-btn"
              onClick={() => {
                setIsAddingOrEditing(false);
                setEditingFeedbackId(null);
                setSelectedClass('');
                setNoteContent('');
              }}
            >
              &times;
            </span>
            <h3>{editingFeedbackId ? 'Edit Feedback' : 'Add New Feedback'}</h3>
            <form onSubmit={handleSaveFeedback}>
              <div>
                <label htmlFor="classSelect">Class:</label>
                <select
                  id="classSelect"
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '0.375rem', width: '100%' }}
                >
                  <option value="" disabled>
                    Select a class
                  </option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.title}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #E5E7EB',
                  }}
                  placeholder="Write your feedback here"
                />
              </div>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  backgroundColor: '#2563EB',
                  color: '#fff',
                  marginTop: '1rem',
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default FeedbackManager;
