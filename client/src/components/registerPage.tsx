import React, { useState } from 'react';
import './registerPage.css';
import { useNavigate } from 'react-router-dom';

interface RegistrationFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  address: string;
  golfExperience: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  medicalInformation: string;
  agreeToTerms: boolean;
}

const styles = {
    logo: {
      width: '200px',
      height: 'auto',
    },
};

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    address: '',
    golfExperience: '',
    medicalInformation: '',
    agreeToTerms: false
  });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: RegistrationFormData['golfExperience']) => {
    setFormData(prev => ({
      ...prev,
      golfExperience: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Implement API call to register user
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <div className="registration-header">
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo" style={styles.logo} />
        </div>
        
        <h2>Edu-Sports Academy Registration</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="name-group">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Middle Name (Optional)</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="two-column">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="two-column">
            <div className="input-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="emergency-contact">
            <div className="input-group">
              <label>Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Emergency Contact Relationship</label>
              <input
                type="text"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="experience-level">
            <label>Golf Experience Level (Select Experience Level)</label>
            <div className="radio-group">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <div key={level} className="radio-option">
                  <input
                    type="radio"
                    id={level}
                    name="golfExperience"
                    checked={formData.golfExperience === level}
                    onChange={() => handleRadioChange(level as RegistrationFormData['golfExperience'])}
                    required
                  />
                  <label htmlFor={level}>{level}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Relevant Medical Information</label>
            <textarea
              name="medicalInformation"
              value={formData.medicalInformation}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="terms-agreement">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
              required
            />
            <label>Mark this to agree with our privacy and medical statements</label>
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
      
      <div className="registration-side">
        <h2>Get ready to ace life,<br />on and off the course!</h2>
      </div>
      <button onClick={handleBack} className="back-button">
        ← Back to Login
      </button>
    </div>
  );
};

export default RegistrationPage;