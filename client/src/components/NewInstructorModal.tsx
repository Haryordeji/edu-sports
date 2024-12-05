import React, { useState } from 'react';
import instance from '../utils/axios';
import { GolfLevels } from '../interfaces';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NewInstructorModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NewInstructorModal: React.FC<NewInstructorModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    golf_experience: '',
    level: [] as number []
  });
  const [error, setError] = useState('');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, levelValue: number) => {
    setFormData((prevData) => {
      const updatedLevels = e.target.checked
        ? [...prevData.level, levelValue]
        : prevData.level.filter((level) => level !== levelValue);
      return { ...prevData, level: updatedLevels };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleQuillInputChange = (value: any) => {
    setFormData((prevData) => ({ ...prevData, golf_experience: value }));
  }; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        user_type: 'instructor',  // Assuming all new registrations are instructors
        golf_experience: formData.golf_experience,
        level: formData.level  
      };
      await instance.post('/registerInstructor', payload, { withCredentials: true });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error creating instructor. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Instructor</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
            
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
    
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <div className='new-instructor-quill'>
            <ReactQuill
              id="experience"
              placeholder="Experience and Certifications"
              value={formData.golf_experience}
              onChange={handleQuillInputChange}
              style={{ height: "200px" }}
              
            />
          </div>

          <div>
            <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
              Levels Teaching:
            </label>
            <div id="golf-levels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {Object.entries(GolfLevels)
                .filter(([key, value]) => isNaN(Number(key)) && Number(value) !== 7)
                .map(([label, value])  => (
                  <div key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id={`level-${value}`}
                      name="level"
                      value={value}
                      checked={formData.level.includes(Number(value))}
                      onChange={(e) => handleCheckboxChange(e, Number(value))}
                    />
                    <label htmlFor={`level-${value}`} style={{ cursor: 'pointer' }}>
                      {label}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInstructorModal;
