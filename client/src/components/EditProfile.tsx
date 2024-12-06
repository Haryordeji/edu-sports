import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { GolfLevels, RegistrationFormData } from '../interfaces';
import "./editProfile.css";
import { PhoneNumber } from '../interfaces';

interface ProfileResponse {
  success: boolean;
  user: RegistrationFormData;
}

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

  

  const storedUserJson = localStorage.getItem('user');
  let storedUserId = ''
  let storedUserType = ''
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type
  }

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

  const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    const levelIndex = Number(value);

    setFormData((prevState) => {
        if (!prevState) return null;
        const currentLevels = prevState.level ?? []; 
        const updatedLevels = checked
            ? [...currentLevels, levelIndex]
            : currentLevels.filter((level) => level !== levelIndex);
        return {
            ...prevState,
            level: updatedLevels,
        };
    });
  };

  const handleLevelChangeForRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const levelIndex = Number(value);
  
    setFormData((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        level: [levelIndex],
      };
    });
  };

  const handleEmergencyContactPhoneChange = (
    field: keyof PhoneNumber, // Adjusted to match PhoneNumber keys
    value: string
  ) => {
    setFormData((prev: RegistrationFormData | null) =>
      prev
        ? {
            ...prev,
            emergencyContact: {
              ...prev.emergencyContact,
              phone: {
                ...prev.emergencyContact.phone,
                [field]: value, // Update the specific phone field dynamically
              },
            },
          }
        : null
    );
  };

  const handlePhysicianContactPhoneChange = (
    field: keyof PhoneNumber, // Adjusted to match PhoneNumber keys
    value: string
  ) => {
    setFormData((prev: RegistrationFormData | null) =>
      prev
        ? {
            ...prev,
            physician: {
              ...prev.physician,
              phone: {
                ...prev.physician.phone,
                [field]: value, // Update the specific phone field dynamically
              },
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
        navigate(`/profile/${id}/?src=edit`);
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
    <div className="edit-profile-container">
      <div className="edit-profile-wrapper">
        <div className="profile-header">
          <div className="logo-section">
            <img 
              src="/swing2tee_logo.png" 
              alt="Swing 2 Tee Logo" 
              onClick={() => navigate(0)} 
            />
            <h1 className="header-title">Edu-Sports Academy</h1>
          </div>
          <button 
            onClick={() => navigate(-2)} 
            className="back-button"
          >
            ← Back
          </button>
        </div>
  
        <div className="form-section">
          <h2 className="section-title">Edit Profile</h2>
          {formData && (
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="section-group">
                <h3 className="section-title">Personal Information</h3>
                <div className="input-group">
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
  
                <div className="input-group">
                  <label htmlFor="middleInitial">Middle Name</label>
                  <input
                    type="text"
                    id="middleInitial"
                    name="middleInitial"
                    value={formData.middleInitial || ''}
                    onChange={(e) => handleNameChange('middleInitial', e.target.value)}
                  />
                </div>
  
                <div className="input-group">
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
              </div>
  
              {/* Contact Information */}
              <div className="section-group">
                <h3 className="section-title">Contact Information</h3>
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
  
                <div className="address-details">
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
  
                  <div className="input-group">
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
  
              {/* Golf Information */}
              <div className="section-group">
                <h3 className="section-title">Golf Information</h3>
                <div className="radio-group">
                  <label>Golf Experience</label>
                  <div className="experience-options">
                    {[
                      { value: 'none', label: 'None' },
                      { value: 'veryLittle', label: 'Very Little' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'aLot', label: 'A Lot' }
                    ].map((option) => (
                      <label key={option.value} className="radio-option">
                        <input
                          type="radio"
                          name="golfExperience"
                          value={option.value}
                          checked={formData.golfExperience === option.value}
                          onChange={handleInputChange}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
  
                <div className="handedness-group">
                  <label>Handedness</label>
                  <div className="radio-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="handedness"
                        value="right"
                        checked={formData.handedness === 'right'}
                        onChange={handleInputChange}
                      />
                      Right Handed
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="handedness"
                        value="left"
                        checked={formData.handedness === 'left'}
                        onChange={handleInputChange}
                      />
                      Left Handed
                    </label>
                  </div>
                </div>
  
                {storedUserType === "admin" && (
                  <div className="level-group">
                    <label>Select Golf Level(s):</label>
                    <div className={formData.user_type !== "golfer" ? "checkbox-group" : "radio-group"}>
                      {Object.keys(GolfLevels)
                        .filter((key) => isNaN(Number(key)) && key !== "Unassigned")
                        .map((level, index) => (
                          <label key={index} className={formData.user_type !== "golfer" ? "checkbox-option" : "radio-option"}>
                            <input
                              type={formData.user_type !== "golfer" ? "checkbox" : "radio"}
                              name="golf-level"
                              value={index}
                              checked={formData.user_type !== "golfer" 
                                ? formData.level?.includes(index) 
                                : formData.level?.[0] === index}
                              onChange={formData.user_type !== "golfer" 
                                ? handleLevelChange 
                                : handleLevelChangeForRadio}
                            />
                            {level}
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
  
              {/* Personal Details */}
              <div className="section-group">
                <h3 className="section-title">Personal Details</h3>
                <div className="gender-group">
                  <label>Gender</label>
                  <div className="radio-options">
                    {['male', 'female', 'other'].map((gender) => (
                      <label key={gender} className="radio-option">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleInputChange}
                        />
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
  
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
  
              {/* Emergency Contact Section */}
              <div className="emergency-section">
                <h3>EMERGENCY CONTACT - (Other than Participant/Parent/Legal Guardian)</h3>
                <div className="input-group">
                  <label>Physician's Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.physician.name || ''}
                    onChange={(e) => handlePhysicianNameChange(e.target.value)}
                    required
                  />
                </div>
  
                <div className="phone-input">
                  <label>Physician Phone</label>
                  <div className="phone-parts">
                    <input
                      type="text"
                      value={formData.physician.phone?.areaCode || ''}
                      onChange={(e) => handlePhysicianContactPhoneChange('areaCode', e.target.value)}
                      maxLength={3}
                      placeholder="Area Code"
                      required
                    />
                    <input
                      type="text"
                      value={formData.physician?.phone?.prefix || ''}
                      onChange={(e) => handlePhysicianContactPhoneChange('prefix', e.target.value)}
                      maxLength={3}
                      placeholder="Prefix"
                      required
                    />
                    <input
                      type="text"
                      value={formData.physician?.phone?.lineNumber || ''}
                      onChange={(e) => handlePhysicianContactPhoneChange('lineNumber', e.target.value)}
                      maxLength={4}
                      placeholder="Line Number"
                      required
                    />
                  </div>
                </div>
  
                <div className="phone-input">
                  <label>Emergency Contact Phone</label>
                  <div className="phone-parts">
                    <input
                      type="text"
                      value={formData.emergencyContact.phone?.areaCode || ''}
                      onChange={(e) => handleEmergencyContactPhoneChange('areaCode', e.target.value)}
                      maxLength={3}
                      placeholder="Area Code"
                      required
                    />
                    <input
                      type="text"
                      value={formData.emergencyContact?.phone?.prefix || ''}
                      onChange={(e) => handleEmergencyContactPhoneChange('prefix', e.target.value)}
                      maxLength={3}
                      placeholder="Prefix"
                      required
                    />
                    <input
                      type="text"
                      value={formData.emergencyContact?.phone?.lineNumber || ''}
                      onChange={(e) => handleEmergencyContactPhoneChange('lineNumber', e.target.value)}
                      maxLength={4}
                      placeholder="Line Number"
                      required
                    />
                  </div>
                </div>
                <div className="medical-info-group">
                <h4>Relevant Medical Information</h4>
                <textarea
                 name="medicalInformation"
                 value={formData.medicalInformation}
                 onChange={handleInputChange}
                 rows={4}
                 />
               </div>
              </div>
  
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
