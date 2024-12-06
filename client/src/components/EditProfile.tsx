import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import instance from '../utils/axios';
import { GolfLevels, RegistrationFormData, PhoneNumber } from '../interfaces';
import "./editProfile.css";
import ReactQuill from 'react-quill';

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
  const [profile, setProfile] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  
  // Get stored user type
  const storedUserJson = localStorage.getItem('user');
  const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;
  const userType = storedUser?.user_type || '';

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.get<ProfileResponse>(`/users/${id}`, { withCredentials: true });
        setFormData(response.data.user);
        setProfile(response.data.user);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleQuillInputChange = (value: any) => {
    setFormData((prevData) => {
      if (!prevData) return null; // Check for null
      return { ...prevData, golfExperience: value }; // Corrected property name
    });
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
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, levelValue: number) => {
    setFormData((prevData) => {
      if (!prevData || !prevData.level) return prevData; // Ensure prevData and level are not null
  
      const updatedLevels = e.target.checked
        ? [...prevData.level, levelValue]
        : prevData.level.filter((level) => level !== levelValue);
  
      return { ...prevData, level: updatedLevels };
    });
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
        setIsSubmitted(true);
        navigate(`/profile/${id}`, { state: { fromEditPage: true } });
      }
    } catch (err) {
      setError('Failed to save profile data');
    }
  };



  // Dynamic form rendering based on user type
  const renderFormByUserType = () => {
    if (!formData) return null;

    if (profile.user_type.toLowerCase() === 'golfer') {
      return (
            <div className="form-section">
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
                          { value: 'aLot', label: 'A Lot' },
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
                    <h3>Emergency Contact</h3>
                    <div className="input-group">
                      <label>Physician's Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.physician?.name || ''}
                        onChange={(e) => handlePhysicianNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="phone-input">
                      <label>Physician Phone</label>
                      <div className="phone-parts">
                        <input
                          type="text"
                          value={formData.physician?.phone?.areaCode || ''}
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
                  </div>
                </form>
              )}
            </div>
      );
    }
    

    if (profile.user_type.toLowerCase() === 'admin') {
      return (
        <>
          <div className="section-group">
            <h3 className="section-title">Admin Information</h3>
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
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
            {/* Contact Information */}
            <div className="section-group">
                    <h3 className="section-title">Contact Information</h3>
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
                  <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
                      Teaching Certification:
                    </label>
                  <div className='new-instructor-quill'>
                  <ReactQuill
                    id="experience"
                    placeholder="Experience and Certifications"
                    value={formData?.golfExperience || ''} // Ensure golfExperience exists
                    onChange={handleQuillInputChange}
                    style={{ height: "200px" }}
                  />
            </div>
            </div>
          </div>
        </>
      );
    }

    if (profile.user_type.toLowerCase() === 'instructor') {
      return (
        <div className="form-section">
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
                  <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
                      Teaching Certification:
                    </label>
                  <div className='new-instructor-quill'>

                  <ReactQuill
                    id="experience"
                    placeholder="Experience and Certifications"
                    value={formData?.golfExperience || ''} // Ensure golfExperience exists
                    onChange={handleQuillInputChange}
                    style={{ height: "200px" }}
                  />
                </div>
                </div>
                </form>
              )}
            </div>
      );
    }

    return null; // Default fallback for unsupported user types
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
            onClick={() => {
              if (isSubmitted) {
                navigate(`/profile/${id}`); // Go directly to the profile page
              } else {
                navigate(-1); // Default back navigation
              }
            }}
            className="back-button"
          >
            ← Back
          </button>
        </div>
        <div className="form-section">
          <h2 className="section-title">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            {renderFormByUserType()}
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
