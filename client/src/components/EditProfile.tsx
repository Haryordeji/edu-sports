import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { RegistrationFormData } from '../interfaces';

interface ProfileResponse {
  success: boolean;
  user: RegistrationFormData;
}
const styles = {
  logo: {
    width: '200px',
    height: 'auto',
  },
};

const EditProfile: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegistrationFormData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.get<ProfileResponse>(`/users/${id}`, { withCredentials: true });
        setFormData(response.data.user);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };
  const handleNameChange = (field: 'firstName' | 'lastName' | 'middleInitial', value: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value, // Update the specific name field
          }
        : null
    );
  };
  const handlePhysicianNameChange = (value: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            physician: {
              ...prev.physician,
              name: value, // Update the physician's name field
            },
          }
        : null
    );
  };


  const handlePhoneChange = (field: keyof RegistrationFormData['Phone'], value: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            Phone: {
              ...prev.Phone,
              [field]: value,
            },
          }
        : null
    );
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData) {
        await instance.put(`/users/${id}`, formData, { withCredentials: true });
        navigate(`/profile/${id}`); // Navigate back to the user profile after saving changes
      }
    } catch (err) {
      setError('Failed to save profile data');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="registration-form">
        <div className="registration-header">
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo" style={styles.logo} onClick={() => navigate(0)} />
          <h1>Edu-Sports Academy</h1>
          </div>
          <button 
              onClick={() => navigate(-2)} 
              className="mb-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
            ← Back
          </button>
          <div className="w-full max-w-4xl mx-auto p-4">
      <h2>Edit Profile</h2>
      {formData && (
        <form onSubmit={handleSubmit}>
          <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ''}
            onChange={(e) => handleNameChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
        <label htmlFor="middleInitial">Middle Name</label>
        <input
          type="text"
          id="middleInitial"
          name="middleInitial"
          value={formData.middleInitial || ''} // Default to an empty string if undefined
          onChange={(e) => handleNameChange('middleInitial', e.target.value)} // Use handleNameChange for middleName
        />
      </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName || ''}
            onChange={(e) => handleNameChange('lastName', e.target.value)}
            required
          />
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
                  value={formData.Phone?.areaCode || ''}
                  onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                  maxLength={3}
                  placeholder="Area Code"
                  required
                />
                <input
                  type="text"
                  value={formData.Phone?.prefix || ''}
                  onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                  maxLength={3}
                  placeholder="Prefix"
                  required
                />
                <input
                  type="text"
                  value={formData.Phone?.lineNumber || ''}
                  onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                  maxLength={4}
                  placeholder="Line Number"
                  required
                />
              </div>
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
          {/* Emergency Contact */}
          <div className="emergency-section">
          <h3>EMERGENCY CONTACT - (Other than Participant/Parent/Legal Guardian)</h3>
          <div className="input-group">
            <label>Physician's Name</label>
            <input
              type="text"
              name="name"
              value={formData.physician.name || ''} // Default to empty string if undefined
              onChange={(e) => handlePhysicianNameChange(e.target.value)} // Call the specific handler
              required
            />
          </div>
          <div className="emergency-contact-group">
            <div className="input-group">
              <div className="phone-input">
                <label>Emergency Contact Phone</label>
                <div className="phone-parts">
                  <input
                    type="text"
                    value={formData.emergencyContact.phone?.areaCode || ''}
                    onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                    maxLength={3}
                    placeholder="Area Code"
                    required
                  />
                  <input
                    type="text"
                    value={formData.emergencyContact?.phone?.prefix || ''}
                    onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                    maxLength={3}
                    placeholder="Prefix"
                    required
                  />
                  <input
                    type="text"
                    value={formData.emergencyContact?.phone?.lineNumber || ''}
                    onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                    maxLength={4}
                    placeholder="Line Number"
                    required
                  />
                </div>
              </div>
            </div>
            </div>
            </div>

          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
    </div>
    </div>
  );
};

export default EditProfile;
