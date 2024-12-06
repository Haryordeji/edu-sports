import React, { useState, useEffect } from 'react';
import instance from '../utils/axios';
import { EventResponse, Event } from './WeeklyCalendar';
import { useNavigate } from 'react-router-dom';
import './global.css';

interface ClassFormData {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
}

const ScheduleEditor = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Event[]>([]);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    start: '',
    end: '',
    location: '',
    instructor: '',
    level: 1
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    fetchClasses();
    fetchInstructors();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await instance.get<EventResponse>('/classes', { withCredentials: true });
      const { data } = response;
      if (data.success) {
        setClasses(data.classes.reverse());
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await instance.get<{ success: boolean; instructors: Instructor[] }>('/users/instructors', {
        withCredentials: true,
      });
      const { data } = response;
      if (data.success) {
        setInstructors(data.instructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      start: '',
      end: '',
      location: '',
      instructor: '',
      level: 1
    });
    setEditingClassId(null);
    setScheduleModalOpen(false);
  };

  const handleEdit = (classItem: Event) => {
    const formatDateForInput = (date: Date) => new Date(date).toISOString().slice(0, 16);

    setFormData({
      title: classItem.title,
      start: formatDateForInput(classItem.start),
      end: formatDateForInput(classItem.end),
      location: classItem.location,
      instructor: classItem.instructor,
      level: classItem.level
    });
    setEditingClassId(classItem.class_id);
    setScheduleModalOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (window.confirm("Are you sure you want to delete this class?")){
    try {
      const response = await instance.delete(`/classes/${classId}`, { withCredentials: true });
      const { data } = response;
      if (data.success) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingClassId) {
        response = await instance.put(`/classes/${editingClassId}`, formData, { withCredentials: true });
      } else {
        response = await instance.post('/classes', formData, { withCredentials: true });
      }

      const { data } = response;

      if (data.success) {
        fetchClasses();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  return (
    <div className="schedule-management-container">
      <div className="class-cards-container">
      <div className="schedule-header">
        <button
          onClick={() => setScheduleModalOpen(true)}
          className="create-class-btn"
        >
          + Create New Class
        </button>
      </div>
      {classes.map((classItem) => (
        <div key={classItem.class_id} className="class-card">
          <h3 className="class-title">{classItem.title}</h3>
          <div className="class-info">
            <div className="info-row">
              <span className="info-label">Time:</span>
              <span>{new Date(classItem.start).toLocaleString()} - {new Date(classItem.end).toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span>{classItem.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Instructor:</span>
              <span>{classItem.instructor}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Level:</span>
              <span>{classItem.level}</span>
            </div>
          </div>
          <div className="class-actions">
            <button
              onClick={() => handleEdit(classItem)}
              className="action-button edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(classItem.class_id)}
              className="action-button delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
      
    {isScheduleModalOpen && (
  <div className="modal-overlay">
    <div className="schedule-modal">
      <div className="schedule-modal-header">
        <h2 className="schedule-modal-title">
          {editingClassId ? 'Edit Class' : 'Create New Class'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="schedule-modal-form">
        <div className="form-field">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">End Time</label>
          <input
            type="datetime-local"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Instructor</label>
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select an instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={`${instructor.firstName} ${instructor.lastName}`}>
                {instructor.firstName} {instructor.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
            <option value={4}>Level 4</option>
            <option value={5}>Level 5</option>
          </select>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={resetForm}
            className="modal-btn cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="modal-btn submit-btn"
          >
            {editingClassId ? 'Update Class' : 'Create Class'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ScheduleEditor;
