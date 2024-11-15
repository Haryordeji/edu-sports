import React, { useState, useEffect } from 'react';
import instance from '../utils/axios';
import { EventResponse, Event } from './WeeklyCalendar';

interface ClassFormData {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

const ScheduleEditor = () => {
  const [classes, setClasses] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    start: '',
    end: '',
    location: '',
    instructor: '',
    level: 1
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await instance.get<EventResponse>('/classes', {withCredentials: true});
      const {data} = response;
      if (data.success) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleDelete = async (classId: string) => {
    try {
      const response = await instance.delete(`/classes/${classId}`, {withCredentials: true});
      const {data} = response;
      if (data.success) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await instance.post('classes', formData, {
        withCredentials: true,
      });

      const {data} = response;
      
      if (data.success) {
        fetchClasses();
        setShowForm(false);
        setFormData({
          title: '',
          start: '',
          end: '',
          location: '',
          instructor: '',
          level: 1
        });
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  return (
    <div>
      <h1>Class Schedule</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create New Class'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Start:
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              End:
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Instructor:
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Level:
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
                <option value={5}>Level 5</option>
              </select>
            </label>
          </div>
          <button type="submit">Create Class</button>
        </form>
      )}

      <div>
        {classes.map((classItem) => (
          <div key={classItem.class_id}>
            <h3>{classItem.title}</h3>
            <p>
              Start: {new Date(classItem.start).toLocaleString()}
              <br />
              End: {new Date(classItem.end).toLocaleString()}
              <br />
              Location: {classItem.location}
              <br />
              Instructor: {classItem.instructor}
              <br />
              Level: {classItem.level}
            </p>
            <button onClick={() => handleDelete(classItem.class_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleEditor;