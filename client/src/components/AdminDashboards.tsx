import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../utils/axios';

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
  const [isAddingFeedback, setIsAddingFeedback] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackResponse, classesResponse] = await Promise.all([
          instance.get(`/feedback/${golfer_id}`, { withCredentials: true }),
          instance.get(`/classes`, { withCredentials: true }),
        ]);
        if (feedbackResponse.data.success) setFeedbacks(feedbackResponse.data.feedbacks);
        if (classesResponse.data.success) setClasses(classesResponse.data.classes);
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, [golfer_id]);

  const handleAddFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClass || !noteContent) {
      setMessage('Please select a class and enter feedback content.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.post(
        `/feedback/new`,
        { instructor_id, golfer_id, class_id: selectedClass, note_content: noteContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        setFeedbacks((prev) => [response.data.feedback, ...prev]);
        setSelectedClass('');
        setNoteContent('');
        setIsAddingFeedback(false);
        setMessage('Feedback submitted successfully!');
      } else {
        setMessage('Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error adding feedback:', error);
      setMessage('An error occurred while adding feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setExpandedFeedback(null);
    setIsAddingFeedback(false);
  };

  return (
    <div>
      <h2>Feedback Manager</h2>
      {message && <p>{message}</p>}
      <button onClick={() => setIsAddingFeedback(true)}>Add New Feedback</button>
      <div>
        {feedbacks.map((feedback) => (
          <div
            key={feedback.feedback_id}
            style={{ borderBottom: '1px solid #ccc', padding: '10px', cursor: 'pointer' }}
            onClick={() => setExpandedFeedback(feedback)}
          >
            <p>
              <strong>{feedback.class}</strong> by {feedback.instructor_name} on{' '}
              {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Viewing Feedback */}
      {expandedFeedback && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Feedback Details</h3>
            <p><strong>Class:</strong> {expandedFeedback.class}</p>
            <p><strong>Instructor:</strong> {expandedFeedback.instructor_name}</p>
            <p><strong>Created At:</strong> {new Date(expandedFeedback.createdAt).toLocaleString()}</p>
            <p>{expandedFeedback.note_content}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Adding Feedback */}
      {isAddingFeedback && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Feedback</h3>
            <form onSubmit={handleAddFeedback}>
              <div>
                <label htmlFor="classSelect">Class:</label>
                <select
                  id="classSelect"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select a class</option>
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
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;
