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
              prev
                .map((fb) =>
                  fb.feedback_id === editingFeedbackId
                    ? { ...fb, note_content: noteContent, class: classes.find(cls => cls.class_id === selectedClass)?.title || fb.class }
                    : fb
                )
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            );
            setMessage('Feedback updated successfully!');
          }
          
        } else {
          // Adding new feedback
          response = await instance.post(
            `/feedback/new`,
            { instructor_id, golfer_id, class_id: selectedClass, note_content: noteContent },
            { withCredentials: true }
          );
          if (response.data.success) {
            const newFeedback = response.data.feedback;
            setFeedbacks((prev) =>
              [newFeedback, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            );
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
      <div>
        <div>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
        </div>
        <h2>{fullName}'s Feedback</h2>
        {message && <p>{message}</p>}
        <button
          onClick={() => {
            setIsAddingOrEditing(true);
            setEditingFeedbackId(null);
            setSelectedClass('');
            setNoteContent('');
          }}
        >
          Add New Feedback
        </button>
        <div>
          {feedbacks.length === 0 ? (
            <p>No feedback found for student</p>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.feedback_id}
                style={{ borderBottom: '1px solid #ccc', padding: '10px', cursor: 'pointer' }}
                onClick={() => setExpandedFeedback(feedback)}
              >
                <p>
                  Feedback on <strong>{feedback.class}</strong> by {feedback.instructor_name} on{' '}
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingOrEditing(true);
                      setEditingFeedbackId(feedback.feedback_id);
                      setSelectedClass(classes.find(cls => cls.title === feedback.class)?.class_id || '');
                      setNoteContent(feedback.note_content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(feedback.feedback_id);
                    }}
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
              <h3>Feedback Details</h3>
              <p><strong>Class:</strong> {expandedFeedback.class}</p>
              <p><strong>Instructor:</strong> {expandedFeedback.instructor_name}</p>
              <p><strong>Created At:</strong> {new Date(expandedFeedback.createdAt).toLocaleString()}</p>
              <p>{expandedFeedback.note_content}</p>
              <button onClick={() => setExpandedFeedback(null)}>Close</button>
            </div>
          </div>
        )}
  
        {isAddingOrEditing && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingFeedbackId ? 'Edit Feedback' : 'Add New Feedback'}</h3>
              <form onSubmit={handleSaveFeedback}>
                <div>
                  <label htmlFor="classSelect">Class:</label>
                  <select
                    id="classSelect"
                    value={selectedClass || ''}
                    onChange={(e) => setSelectedClass(e.target.value)}
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
                <div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={5}
                    placeholder="Write your feedback here"
                  />
                </div>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingFeedbackId ? 'Update Feedback' : 'Submit Feedback'}
                </button>
              </form>
              <button
                onClick={() => {
                  setIsAddingOrEditing(false);
                  setEditingFeedbackId(null);
                  setSelectedClass('');
                  setNoteContent('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default FeedbackManager;
  