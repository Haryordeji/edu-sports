import React, { useState, useEffect } from 'react';
import instance from '../utils/axios';
import { EventResponse, Event } from './WeeklyCalendar';
import { useNavigate } from 'react-router-dom';

interface ClassFormData {
  title: string;
  start: string;
  end: string;
  location: string;
  instructor: string;
  level: number;
}

const ScheduleEditor = () => {
  const navigate = useNavigate(); 
  const [classes, setClasses] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
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

  const handleBack = () => {
    navigate(-1); // Goes back one step in history
  };

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
    setShowForm(false);
  };

  const handleEdit = (classItem: Event) => {
    // Convert dates to the format expected by datetime-local input
    const formatDateForInput = (date: Date) => {
      return new Date(date).toISOString().slice(0, 16);
    };

    setFormData({
      title: classItem.title,
      start: formatDateForInput(classItem.start),
      end: formatDateForInput(classItem.end),
      location: classItem.location,
      instructor: classItem.instructor,
      level: classItem.level
    });
    setEditingClassId(classItem.class_id);
    setShowForm(true);
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
      let response;
      if (editingClassId) {
        // Update existing class
        response = await instance.put(`/classes/${editingClassId}`, formData, {
          withCredentials: true,
        });
      } else {
        // Create new class
        response = await instance.post('classes', formData, {
          withCredentials: true,
        });
      }

      const {data} = response;
      
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  return (
    <div className="relative">
      <button 
        onClick={handleBack}
        className="absolute top-0 left-0 p-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← Back
      </button>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Class Schedule Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showForm ? 'Cancel' : 'Create New Class'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingClassId ? 'Edit Class' : 'Create New Class'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
                <option value={3}>Level 3</option>
                <option value={4}>Level 4</option>
                <option value={5}>Level 5</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {editingClassId ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {classes.map((classItem) => (
          <div 
            key={classItem.class_id}
            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{classItem.title}</h3>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">Time:</span>{' '}
                  {new Date(classItem.start).toLocaleString()} - {new Date(classItem.end).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {classItem.location}
                </p>
                <p>
                  <span className="font-medium">Instructor:</span> {classItem.instructor}
                </p>
                <p>
                  <span className="font-medium">Level:</span> {classItem.level}
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(classItem)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(classItem.class_id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleEditor;