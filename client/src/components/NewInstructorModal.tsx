import React, { useState } from 'react';
import instance from '../utils/axios';
import { GolfLevels } from '../interfaces';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { validateEmail, validatePassword, validatePhone, validateName } from '../utils/validation';

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
    phone: {
      areaCode: '',
      prefix: '',
      lineNumber: ''
    },
    golf_experience: '',
    level: [] as number []
  });
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, levelValue: number) => {
    setFormData((prevData) => {
      const updatedLevels = e.target.checked
        ? [...prevData.level, levelValue]
        : prevData.level.filter((level) => level !== levelValue);
      return { ...prevData, level: updatedLevels };
    });
  };

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'first_name':
        const firstNameValidation = validateName(value, 'First name');
        return firstNameValidation.isValid ? '' : firstNameValidation.message;
      case 'last_name':
        const lastNameValidation = validateName(value, 'Last name');
        return lastNameValidation.isValid ? '' : lastNameValidation.message;
      case 'email':
        const emailValidation = validateEmail(value);
        return emailValidation.isValid ? '' : emailValidation.message;
      case 'password':
        const passwordValidation = validatePassword(value);
        return passwordValidation.isValid ? '' : passwordValidation.message;
      case 'phone':
        const phoneValidation = validatePhone(value);
        return phoneValidation.isValid ? '' : phoneValidation.message;
      default:
        return '';
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, formData[fieldName as keyof typeof formData]);
    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handlePhoneChange = (part: 'areaCode' | 'prefix' | 'lineNumber', value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: {
        ...prev.phone,
        [part]: digitsOnly
      }
    }));

    if (touched.phone) {
      const phoneValidation = validatePhone({
        ...formData.phone,
        [part]: digitsOnly
      });
      setFormErrors(prev => ({ ...prev,phone: phoneValidation.isValid ? '' : phoneValidation.message }));
    }
  };

  const handleQuillInputChange = (value: string) => {
    value = DOMPurify.sanitize(value);
    setFormData(prev => ({ ...prev, golf_experience: value.trim() }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    const fields = ['first_name', 'last_name', 'email', 'password'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
    });

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.Phone = phoneValidation.message;
    }

    if (formData.level.length === 0) {
      errors.level = 'Please select at least one level';
    }

    if (!formData.golf_experience.trim()) {
      errors.golf_experience = 'Golf experience is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors before submitting');
      return;
    }

    try {
      const payload = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: `${formData.phone.areaCode}-${formData.phone.prefix}-${formData.phone.lineNumber}`,
        user_type: 'instructor',  
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              onBlur={() => handleBlur('first_name')}
              required
            />
            {touched.first_name && formErrors.first_name && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.first_name}
              </p>
            }
          </div>
          
          <div className="input-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              onBlur={() => handleBlur('last_name')}
              required
            />
            {touched.last_name && formErrors.last_name && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.last_name}
              </p>
            }
          </div>
    
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              required
            />
            {touched.email && formErrors.email && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.email}
              </p>
            }
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              required
            />
            {touched.password && formErrors.password && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.password}
              </p>
            }
          </div>

          <div className="phone-input">
            <label>Phone</label>
            <div className="phone-parts" style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={formData.phone.areaCode}
                onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                onBlur={() => handleBlur('phone')}
                maxLength={3}
                placeholder="000"
                style={{ width: '4rem', textAlign: 'center' }}
                required
              />
              <input
                type="text"
                value={formData.phone.prefix}
                onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                onBlur={() => handleBlur('phone')}
                maxLength={3}
                placeholder="000"
                style={{ width: '4rem', textAlign: 'center' }}
                required
              />
              <input
                type="text"
                value={formData.phone.lineNumber}
                onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                onBlur={() => handleBlur('phone')}
                maxLength={4}
                placeholder="0000"
                style={{ width: '5rem', textAlign: 'center' }}
                required
              />
            </div>
            {touched.phone && formErrors.phone && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.phone}
              </p>
            }
          </div>

          <div className='new-instructor-quill'>
            <ReactQuill
              id="experience"
              placeholder="Experience and Certifications"
              value={formData.golf_experience}
              onChange={handleQuillInputChange}
              style={{ height: "200px" }}
            />
            {touched.golf_experience && formErrors.golf_experience && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.golf_experience}
              </p>
            }
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
            {formErrors.level && 
              <p className="error-message" style={{ color: 'red', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {formErrors.level}
              </p>
            }
          </div>
          
          {error && <p style={{ color: 'red', margin: '0.5rem 0' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
