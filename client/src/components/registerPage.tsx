import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerPage.css';

interface PhoneNumber {
    areaCode: string;
    prefix: string;
    lineNumber: string;
  }
  
  interface EmergencyContact {
    name: string;
    phone: PhoneNumber;
    relationship: string;
  }
  
  interface Physician {
    name: string;
    phone: PhoneNumber;
  }
  
  interface HeardFrom {
    source: 'event' | 'media' | 'school' | 'internet' | 'friend' | '';
    name?: string;
  }
  
  interface RegistrationFormData {
    firstName: string;
    middleInitial: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    Phone: PhoneNumber;
    email: string;
    gender: 'male' | 'female' | 'other' | '';
    dateOfBirth: string;
    height: string;
    handedness: 'right' | 'left' | '';
    heardFrom: HeardFrom;
    golfExperience: 'none' | 'veryLittle' | 'moderate' | 'aLot' | '';
    previousLessons: boolean;
    lessonDuration: string;
    previousInstructor: string;
    password: string;
    emergencyContact: EmergencyContact;
    physician: Physician;
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    Phone: { areaCode: '', prefix: '', lineNumber: '' },
    email: '',
    gender: '',
    dateOfBirth: '',
    height: '',
    handedness: '',
    heardFrom: { source: '', name: '' },
    golfExperience: '',
    previousLessons: false,
    lessonDuration: '',
    previousInstructor: '',
    password: '',
    emergencyContact: {
      name: '',
      phone: { areaCode: '', prefix: '', lineNumber: '' },
      relationship: ''
    },
    physician: {
      name: '',
      phone: { areaCode: '', prefix: '', lineNumber: '' }
    },
    medicalInformation: '',
    agreeToTerms: false
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof RegistrationFormData,
    subField?: string
  ) => {
    const { name, value } = e.target;
  
    if (section && subField) {
      setFormData(prev => {
        // Get the section object
        const sectionObject = prev[section];
        
        // Make sure we're working with an object
        if (typeof sectionObject === 'object' && sectionObject !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionObject,
              [subField]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handlePhoneChange = (
    section: 'Phone' | 'emergencyContact.phone' | 'physician.phone',
    part: 'areaCode' | 'prefix' | 'lineNumber',
    value: string
  ) => {
    setFormData(prev => {
      if (section === 'emergencyContact.phone') {
        return {
          ...prev,
          emergencyContact: {
            ...prev.emergencyContact,
            phone: {
              ...prev.emergencyContact.phone,
              [part]: value
            }
          }
        };
      } else if (section === 'physician.phone') {
        return {
          ...prev,
          physician: {
            ...prev.physician,
            phone: {
              ...prev.physician.phone,
              [part]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [part]: value
          }
        };
      }
    });
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
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo" style={styles.logo} onClick={() => navigate('/')} />
          <h1>Edu-Sports Academy Registraton</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="name-group">
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
            <div className="input-group small">
              <label>Middle Name Initial</label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleInputChange}
                maxLength={1}
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

          {/* Address Fields */}
          <div className="address-group">
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
            <div className="city-state-zip">
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group small">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  maxLength={2}
                />
              </div>
              <div className="input-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  maxLength={5}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-group">
            <div className="phone-input">
              <label>Phone</label>
              <div className="phone-parts">
                <input
                  type="text"
                  value={formData.Phone.areaCode}
                  onChange={(e) => handlePhoneChange('Phone', 'areaCode', e.target.value)}
                  maxLength={3}
                  placeholder="000"
                />
                <input
                  type="text"
                  value={formData.Phone.prefix}
                  onChange={(e) => handlePhoneChange('Phone', 'prefix', e.target.value)}
                  maxLength={3}
                  placeholder="000"
                />
                <input
                  type="text"
                  value={formData.Phone.lineNumber}
                  onChange={(e) => handlePhoneChange('Phone', 'lineNumber', e.target.value)}
                  maxLength={4}
                  placeholder="0000"
                />
              </div>
            </div>
            </div>

          {/* Personal Information */}
          <div className="personal-info-group">
            <div className="gender-group">
              <label>Gender</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  Other
                </label>
              </div>
            </div>

            <div className="age-dob-group">
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
                <label>Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="5'10''"
                />
              </div>
            </div>

            <div className="handedness-group">
              <label>Handedness</label>
              <div className="radio-options">
                <label>
                  <input
                    type="radio"
                    name="handedness"
                    value="right"
                    checked={formData.handedness === 'right'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  Right Handed
                </label>
                <label>
                  <input
                    type="radio"
                    name="handedness"
                    value="left"
                    checked={formData.handedness === 'left'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  Left Handed
                </label>
              </div>
            </div>
          </div>

          {/* How did you hear about us */}
          <div className="heard-from-group">
            <label>How did you hear about our program?</label>
            <div className="source-options">
              {['Event', 'Media', 'School', 'Internet', 'Friend'].map((source) => (
                <label key={source}>
                  <input
                    type="radio"
                    name="heardFromSource"
                    value={source.toLowerCase()}
                    checked={formData.heardFrom.source === source.toLowerCase()}
                    onChange={(e) => handleInputChange(e, 'heardFrom', 'source')}
                  />
                  {source}
                </label>
              ))}
              <input
                type="text"
                name="heardFromName"
                value={formData.heardFrom.name}
                onChange={(e) => handleInputChange(e, 'heardFrom', 'name')}
                placeholder="(Name)"
              />
            </div>
          </div>

          {/* Golf Experience */}
          <div className="golf-experience-group">
            <label>Golf Experience</label>
            <div className="experience-options">
              {[
                { value: 'none', label: 'None' },
                { value: 'veryLittle', label: 'Very Little' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'aLot', label: 'A Lot' }
              ].map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="golfExperience"
                    value={option.value}
                    checked={formData.golfExperience === option.value}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Previous Lessons */}
          <div className="previous-lessons-group">
            <label>Any previous golf lessons?</label>
            <div className="lessons-details">
              <label>
                <input
                  type="checkbox"
                  checked={formData.previousLessons}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousLessons: e.target.checked }))}
                />
                Yes
              </label>
              {formData.previousLessons && (
                <>
                  <div className="input-group">
                    <label>How long</label>
                    <input
                      type="text"
                      name="lessonDuration"
                      value={formData.lessonDuration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>From whom</label>
                    <input
                      type="text"
                      name="previousInstructor"
                      value={formData.previousInstructor}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="emergency-section">
            <h3>EMERGENCY CONTACT - (Other than Participant/Parent/Legal Guardian)</h3>
            <div className="emergency-contact-group">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange(e, 'emergencyContact', 'name')}
                  required
                />
              </div>
              
              <div className="phone-input">
                <label>Phone </label>
                <div className="phone-parts">
                  <input
                    type="text"
                    value={formData.emergencyContact.phone.areaCode}
                    onChange={(e) => handlePhoneChange('emergencyContact.phone', 'areaCode', e.target.value)}
                    maxLength={3}
                    required
                  />
                  <input
                    type="text"
                    value={formData.emergencyContact.phone.prefix}
                    onChange={(e) => handlePhoneChange('emergencyContact.phone', 'prefix', e.target.value)}
                    maxLength={3}
                    required
                  />
                  <input
                    type="text"
                    value={formData.emergencyContact.phone.lineNumber}
                    onChange={(e) => handlePhoneChange('emergencyContact.phone', 'lineNumber', e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Relationship</label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange(e, 'emergencyContact', 'relationship')}
                  required
                />
              </div>
            </div>

            {/* Physician Information */}
            <div className="physician-group">
              <div className="input-group">
                <label>Physician's Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.physician.name}
                  onChange={(e) => handleInputChange(e, 'physician', 'name')}
                  required
                />
              </div>

              <div className="phone-input">
                <label>Phone</label>
                <div className="phone-parts">
                  <input
                    type="text"
                    value={formData.physician.phone.areaCode}
                    onChange={(e) => handlePhoneChange('physician.phone', 'areaCode', e.target.value)}
                    maxLength={3}
                    required
                  />
                  <input
                    type="text"
                    value={formData.physician.phone.prefix}
                    onChange={(e) => handlePhoneChange('physician.phone', 'prefix', e.target.value)}
                    maxLength={3}
                    required
                  />
                  <input
                    type="text"
                    value={formData.physician.phone.lineNumber}
                    onChange={(e) => handlePhoneChange('physician.phone', 'lineNumber', e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="medical-info-group">
              <label>Relevant Medical Information</label>
              <textarea
                name="medicalInformation"
                value={formData.medicalInformation}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="terms-agreement">
            <label>
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                required
              />
              Mark this to agree with our privacy and medical statements
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
      
      <div className="registration-side">
        <h2>Get ready to ace life,<br />on and off the course!</h2>
      </div>
    </div>
  );
};

export default RegistrationPage;