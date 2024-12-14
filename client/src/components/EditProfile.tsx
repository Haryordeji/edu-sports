import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import instance from '../utils/axios';
import { GolfLevels, RegistrationFormData, PhoneNumber } from '../interfaces';
import "./editProfile.css";
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import * as validation from '../utils/validation';
import { FormErrors } from '../interfaces/formErrors';

// Helper type to access nested properties
type NestedValue = {
  emergencyContact?: {
    name?: string;
    relationship?: string;
  };
  physician?: {
    name?: string;
  };
};

const getNestedValue = (obj: RegistrationFormData, path: string): any => {
  if (path.includes('.')) {
    const [section, field] = path.split('.');
    const sectionData = obj[section as keyof RegistrationFormData];
    
    // Type guard for nested objects
    if (sectionData && typeof sectionData === 'object') {
      // Handle specific nested structures
      if (section === 'emergencyContact') {
        return (sectionData as RegistrationFormData['emergencyContact'])[field as keyof RegistrationFormData['emergencyContact']];
      }
      if (section === 'physician') {
        return (sectionData as RegistrationFormData['physician'])[field as keyof RegistrationFormData['physician']];
      }
    }
    return undefined;
  }
  return obj[path as keyof RegistrationFormData];
};

interface ProfileResponse {
  success: boolean;
  user: RegistrationFormData;
}

// Add this helper function after the imports and before the component
const getErrorMessage = (error: string | { [key: string]: string } | undefined): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  // If it's an object, return the first error message found
  return Object.values(error)[0] || '';
};

const EditProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const storedUserJson = localStorage.getItem('user');
  let storedUserType = '';
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserType = storedUser.user_type;
  }
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleBooleanInputChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value === "true" } : null));
  };

  const handleQuillInputChange = (value: any) => {
    value = DOMPurify.sanitize(value);
    setFormData((prevData) => {
      if (!prevData) return null; // Check for null
      return { ...prevData, golfExperience: value.trim() }; // Corrected property name
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
  

  const validateField = (name: string, value: any) => {
    let error = '';
    
    switch (name) {
      case 'email':
        const emailResult = validation.validateEmail(value);
        error = emailResult.message;
        break;

      case 'firstName':
        const firstNameResult = validation.validateName(value, 'First name');
        error = firstNameResult.message;
        break;

      case 'lastName':
        const lastNameResult = validation.validateName(value, 'Last name');
        error = lastNameResult.message;
        break;

      case 'middleInitial':
        const middleInitialResult = validation.validateMiddleInitial(value);
        error = middleInitialResult.message;
        break;

      case 'dateOfBirth':
        if (formData?.user_type == "golfer") {
          const dobResult = validation.validateDateOfBirth(value);
          error = dobResult.message;
        }
        break;

      case 'address':
        const addressResult = validation.validateAddress(value);
        error = addressResult.message;
        break;

      case 'city':
        if (formData?.user_type == "golfer") {
          const cityResult = validation.validateCity(value);
          error = cityResult.message;          
        }

        break;

      case 'zipCode':
        const zipResult = validation.validateZipCode(value);
        error = zipResult.message;
        break;

      case 'emergencyContact.name':
        if (formData?.user_type == "golfer") {
          if (typeof value === 'string') {
            const emergencyContactNameResult = validation.validateName(value, 'Emergency contact name');
            error = emergencyContactNameResult.message;
          }
        }
        break;

      case 'emergencyContact.relationship':
        if (formData?.user_type == "golfer") {  
          if (typeof value === 'string') {
            const relationshipResult = validation.validateRelationship(value);
            error = relationshipResult.message;
          }          
        }
        break;

      case 'physician.name':
        if (formData?.user_type == "golfer") {
          if (typeof value === 'string') {
            const physicianNameResult = validation.validateName(value, 'Physician name');
            error = physicianNameResult.message;
          }          
        }

        break;

      case 'Phone':
        if (formData?.Phone) {
          const phoneResult = validation.validatePhone(formData.Phone);
          error = phoneResult.message;
        }
        break;

      case 'emergencyContact.phone':
        if (storedUserType === 'golfer' && formData?.emergencyContact?.phone) { 
          if (formData?.emergencyContact?.phone) {
            const emergencyPhoneResult = validation.validatePhone(formData.emergencyContact.phone);
            error = emergencyPhoneResult.message;
          }
        }
        break;

      case 'physician.phone':
        if (formData?.user_type == "golfer") {
          if (formData?.physician?.phone) {
            const physicianPhoneResult = validation.validatePhone(formData.physician.phone);
            error = physicianPhoneResult.message;
          }
        }
        break;
    }

    setFormErrors(prev => {
      const newErrors = { ...prev };
      if (name.includes('.')) {
        const [section, field] = name.split('.');
        newErrors[section] = {
          ...((newErrors[section] as { [key: string]: string }) || {}),
          [field]: error || ''
        };
      } else {
        newErrors[name] = error || '';
      }
      return newErrors;
    });

    return !error;
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    if (formData) {
      validateField(fieldName, formData[fieldName as keyof RegistrationFormData]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define all fields that need validation
    const allFields = [
      'firstName', 'lastName', 'middleInitial', 'dateOfBirth', 'address', 
      'city', 'state', 'zipCode', 'Phone', 'email',
      'emergencyContact.name', 'emergencyContact.relationship', 'emergencyContact.phone',
      'physician.name', 'physician.phone'
    ];
    
    // Mark all fields as touched to show any validation errors
    const newTouched = { ...touched };
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    let isValid = true;
    allFields.forEach(field => {
      if (formData) {
        const fieldValue = getNestedValue(formData, field);
        if (!validateField(field, fieldValue)) {
          isValid = false;
          console.log('Validation error for field:', field);
        }
      }
    });

    // If there are any validation errors, prevent submission
    if (!isValid) {
      alert('Please fix all validation errors before saving.');
      return;
    }

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
                        onBlur={() => handleBlur('firstName')}
                        required
                      />
                      {touched.firstName && formErrors.firstName && 
                        <p className="error-message">{formErrors.firstName}</p>
                      }
                    </div>
                    <div className="input-group">
                      <label htmlFor="middleInitial">Middle Name</label>
                      <input
                        type="text"
                        id="middleInitial"
                        name="middleInitial"
                        value={formData.middleInitial || ''}
                        onChange={(e) => handleNameChange('middleInitial', e.target.value)}
                        onBlur={() => handleBlur('middleInitial')}
                      />
                      {touched.middleInitial && formErrors.middleInitial && 
                        <p className="error-message">{formErrors.middleInitial}</p>
                      }
                    </div>
                    <div className="input-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={(e) => handleNameChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        required
                      />
                      {touched.lastName && formErrors.lastName && 
                        <p className="error-message">{formErrors.lastName}</p>
                      }
                    </div>

                    <div className="input-group">
                      <label>Gender</label>
                      <div className="radio-group">
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
                        onBlur={() => handleBlur('dateOfBirth')}
                        required
                      />
                      {touched.dateOfBirth && formErrors.dateOfBirth && 
                        <p className="error-message">{formErrors.dateOfBirth}</p>
                      }
                    </div>

                    <div className="input-group">
                      <label>Height</label>
                      <div className="height-selection">
                        <select
                          name="height"
                          value={formData?.height?.split("'")[0] || ""}
                          onChange={(e) => {
                            if (formData) {
                              const feet = e.target.value;
                              const inches = formData.height?.split("'")[1]?.replace('"', '') || "0";
                              setFormData({
                                ...formData,
                                height: `${feet}'${inches}"`
                              });
                            }
                          }}
                          required
                        >
                          <option value="">Feet</option>
                          {Array.from({ length: 5 }, (_, i) => i + 2).map((feet) => (
                            <option key={feet} value={feet}>
                              {feet}'
                            </option>
                          ))}
                        </select>
                        <select
                          name="height-inches"
                          value={formData?.height?.split("'")[1]?.replace('"', '') || ""}
                          onChange={(e) => {
                            if (formData) {
                              const feet = formData.height?.split("'")[0] || "5";
                              const inches = e.target.value;
                              setFormData({
                                ...formData,
                                height: `${feet}'${inches}"`
                              });
                            }
                          }}
                          required
                        >
                          <option value="">Inches</option>
                          {Array.from({ length: 12 }, (_, i) => i).map((inch) => (
                            <option key={inch} value={inch}>
                              {inch}"
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    
                  </div>
    
                  {/* Contact Information */}
                  <div className="section-group">
                    <h3 className="section-title">Contact Details</h3>
                    <div className="input-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('address')}
                        required
                      />
                      {touched.address && formErrors.address && 
                        <p className="error-message">{formErrors.address}</p>
                      }
                    </div>
                    <div className="address-details">
                      <div className="input-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('city')}
                          required
                        />
                        {touched.city && formErrors.city && 
                          <p className="error-message">{formErrors.city}</p>
                        }
                      </div>
                      <div className="input-group">
                        <label>State</label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('state')}
                          required
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        {touched.state && formErrors.state && 
                          <p className="error-message">{formErrors.state}</p>
                        }
                      </div>
                      <div className="input-group">
                        <label>Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('zipCode')}
                          required
                          maxLength={5}
                        />
                        {touched.zipCode && formErrors.zipCode && 
                          <p className="error-message">{formErrors.zipCode}</p>
                        }
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <div className="phone-parts">
                        <input
                          type="text"
                          value={formData.Phone?.areaCode || ''}
                          onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                          onBlur={() => handleBlur('Phone')}
                          maxLength={3}
                          placeholder="000"
                          required
                        />
                        <input
                          type="text"
                          value={formData.Phone?.prefix || ''}
                          onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                          onBlur={() => handleBlur('Phone')}
                          maxLength={3}
                          placeholder="000"
                          required
                        />
                        <input
                          type="text"
                          value={formData.Phone?.lineNumber || ''}
                          onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                          onBlur={() => handleBlur('Phone')}
                          maxLength={4}
                          placeholder="0000"
                          required
                        />
                      </div>
                      {touched.Phone && formErrors.Phone && 
                        <p className="error-message">{getErrorMessage(formErrors.Phone)}</p>
                      }
                    </div>
                  </div>
    
                  {/* Golf Information */}
                  <div className="input-group">
                    <h3 className="section-title">Golf Experience</h3>
                    <label>Select Golf Level(s):</label>

                    <div className="radio-group">
                      {Object.keys(GolfLevels)
                        .filter((key) => isNaN(Number(key)) && key !== "Unassigned")
                        .map((level, index) => (
                          <label key={index} className="radio-option">
                            <input
                              type="radio"
                              name="golf-level"
                              value={index}
                              checked={formData.level?.[0] === index}
                              onChange={handleLevelChangeForRadio}
                              required
                            />
                            {level}
                          </label>
                        ))}
                    </div>
                    <label>Any Previous Golf Experience?</label>
                    <div className="radio-group">
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
                  <div className="input-group">
                      <label>How did you hear about us?</label>
                      <div className="radio-group">
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
                    <div className="input-group">
                        <label>Have you taken lessons before?</label>
                        <div className="radio-group">
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="previousLessons"
                              value="true"
                              checked={formData.previousLessons === true}
                              onChange={(e) => handleBooleanInputChange(e.target.name, e.target.value)}
                            />
                            Yes
                          </label>
                          <label className="radio-option">
                            <input
                              type="radio"
                              name="previousLessons"
                              value="false"
                              checked={formData.previousLessons === false}
                              onChange={(e) => handleBooleanInputChange(e.target.name, e.target.value)}
                            />
                            No
                          </label>
                        </div>
                      </div>

                      {formData.previousLessons && (
                        <>
                          <div className="input-group">
                            <label>Lesson Duration</label>
                            <input
                              type="text"
                              name="lessonDuration"
                              value={formData.lessonDuration || ''}
                              onChange={handleInputChange}
                              placeholder="e.g., 6 months"
                            />
                          </div>
                          <div className="input-group">
                            <label>Previous Instructor</label>
                            <input
                              type="text"
                              name="previousInstructor"
                              value={formData.previousInstructor || ''}
                              onChange={handleInputChange}
                              placeholder="Instructor's name"
                            />
                          </div>
                        </>
                      )}
                    {/* Referral Information */}
                    <div className="section-group">
                      <h3 className="section-title">Referral Information</h3>
                      <div className="input-group">
                        <label>How did you hear about us?</label>
                        <select
                          name="heardFrom"
                          value={formData.heardFrom?.source || ''}
                          onChange={(e) => {
                            const updatedFormData: RegistrationFormData = {
                              ...formData,
                              heardFrom: {
                                ...formData.heardFrom,
                                source: e.target.value as "" | "event" | "media" | "school" | "internet" | "friend"
                              }
                            };
                            setFormData(updatedFormData);
                          }}
                        >
                          <option value="">Select an option</option>
                          <option value="friend">Friend</option>
                          <option value="internet">Internet</option>
                          <option value="media">Media</option>
                          <option value="school">School</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                      
                      {formData.heardFrom?.source && formData.heardFrom.source !== 'internet' && formData.heardFrom.source !== 'media' && (
                        <div className="input-group">
                          <label>Referral Name</label>
                          <input
                            type="text"
                            name="referralName"
                            value={formData.heardFrom?.name || ''}
                            onChange={(e) => {
                              const updatedFormData: RegistrationFormData = {
                                ...formData,
                                heardFrom: {
                                  ...formData.heardFrom,
                                  name: e.target.value
                                }
                              };
                              setFormData(updatedFormData);
                            }}
                            placeholder="Name of person who referred you"
                          />
                        </div>
                      )}
                    </div>
                    </div>
    
                  
    
                  {/* Emergency Contact Section */}
                    <div className="section-group">
                      <h3 className="section-title">Emergency Contact</h3>
                      <div className="input-group">
                        <label>Emergency Contact Name</label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContact?.name || ''}
                          onChange={(e) => {
                            setFormData(prev => 
                              prev ? {
                                ...prev,
                                emergencyContact: {
                                  ...prev.emergencyContact,
                                  name: e.target.value
                                }
                              } : null
                            );
                            validateField('emergencyContact.name', e.target.value);
                          }}
                          onBlur={() => handleBlur('emergencyContact.name')}
                          required
                        />
                        {touched['emergencyContact.name'] && formErrors.emergencyContact?.name && 
                          <p className="error-message">{formErrors.emergencyContact.name}</p>
                        }
                      </div>
                      
                      <div className="input-group">
                        <label>Relationship</label>
                        <input
                          type="text"
                          name="emergencyContactRelationship"
                          value={formData.emergencyContact?.relationship || ''}
                          onChange={(e) => {
                            setFormData(prev => 
                              prev ? {
                                ...prev,
                                emergencyContact: {
                                  ...prev.emergencyContact,
                                  relationship: e.target.value
                                }
                              } : null
                            );
                            validateField('emergencyContact.relationship', e.target.value);
                          }}
                          onBlur={() => handleBlur('emergencyContact.relationship')}
                          required
                        />
                        {touched['emergencyContact.relationship'] && formErrors.emergencyContact?.relationship && 
                          <p className="error-message">{formErrors.emergencyContact.relationship}</p>
                        }
                      </div>
                      
                      <div className="input-group">
                        <label>Emergency Contact Phone</label>
                        <div className="phone-parts">
                          <input
                            type="text"
                            value={formData.emergencyContact?.phone?.areaCode || ''}
                            onChange={(e) => handleEmergencyContactPhoneChange('areaCode', e.target.value)}
                            onBlur={() => handleBlur('emergencyContact.phone')}
                            maxLength={3}
                            placeholder="000"
                            required
                          />
                          <input
                            type="text"
                            value={formData.emergencyContact?.phone?.prefix || ''}
                            onChange={(e) => handleEmergencyContactPhoneChange('prefix', e.target.value)}
                            onBlur={() => handleBlur('emergencyContact.phone')}
                            maxLength={3}
                            placeholder="000"
                            required
                          />
                          <input
                            type="text"
                            value={formData.emergencyContact?.phone?.lineNumber || ''}
                            onChange={(e) => handleEmergencyContactPhoneChange('lineNumber', e.target.value)}
                            onBlur={() => handleBlur('emergencyContact.phone')}
                            maxLength={4}
                            placeholder="0000"
                            required
                          />
                        </div>
                        {touched['emergencyContact.phone'] && formErrors.emergencyContact?.phone && 
                          <p className="error-message">{getErrorMessage(formErrors.emergencyContact.phone)}</p>
                        }
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="section-group">
                      <h3 className="section-title">Medical Information</h3>
                      <div className="input-group">
                        <label>Medical Information</label>
                        <ReactQuill
                          value={formData.medicalInformation || ''}
                          onChange={(value) => setFormData(prev => 
                            prev ? {
                              ...prev,
                              medicalInformation: value
                            } : null
                          )}
                          placeholder="Please provide any relevant medical information..."
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Physician's Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.physician?.name || ''}
                        onChange={(e) => {
                          handlePhysicianNameChange(e.target.value);
                          validateField('physician.name', e.target.value);
                        }}
                        onBlur={() => handleBlur('physician.name')}
                        required
                      />
                      {touched['physician.name'] && formErrors.physician?.name && 
                        <p className="error-message">{formErrors.physician.name}</p>
                      }
                    </div>
                    <div className="input-group">
                      <label>Physician Phone</label>
                      <div className="phone-parts">
                        <input
                          type="text"
                          value={formData.physician?.phone?.areaCode || ''}
                          onChange={(e) => handlePhysicianContactPhoneChange('areaCode', e.target.value)}
                          onBlur={() => handleBlur('physician.phone')}
                          maxLength={3}
                          placeholder="000"
                          required
                        />
                        <input
                          type="text"
                          value={formData.physician?.phone?.prefix || ''}
                          onChange={(e) => handlePhysicianContactPhoneChange('prefix', e.target.value)}
                          onBlur={() => handleBlur('physician.phone')}
                          maxLength={3}
                          placeholder="000"
                          required
                        />
                        <input
                          type="text"
                          value={formData.physician?.phone?.lineNumber || ''}
                          onChange={(e) => handlePhysicianContactPhoneChange('lineNumber', e.target.value)}
                          onBlur={() => handleBlur('physician.phone')}
                          maxLength={4}
                          placeholder="0000"
                          required
                        />
                      </div>
                      {touched['physician.phone'] && formErrors.physician?.phone && 
                        <p className="error-message">{getErrorMessage(formErrors.physician.phone)}</p>
                      }
                    </div>
                    
                </form>
              )}
            </div>
      );
    }
    

    if (profile.user_type.toLowerCase() === 'admin') {
      return (
        <>
          {/* Admin Information Section */}
        <div className="section-group">
          <h3 className="section-title">Admin Information</h3>
          <div className="input-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ''}
              onChange={(e) => handleNameChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              required
            />
            {touched.firstName && formErrors.firstName && 
              <p className="error-message">{formErrors.firstName}</p>
            }
          </div>
          <div className="input-group">
            <label htmlFor="middleInitial">Middle Name</label>
            <input
              type="text"
              id="middleInitial"
              name="middleInitial"
              value={formData.middleInitial || ''}
              onChange={(e) => handleNameChange('middleInitial', e.target.value)}
              onBlur={() => handleBlur('middleInitial')}
            />
            {touched.middleInitial && formErrors.middleInitial && 
              <p className="error-message">{formErrors.middleInitial}</p>
            }
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ''}
              onChange={(e) => handleNameChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              required
            />
            {touched.lastName && formErrors.lastName && 
              <p className="error-message">{formErrors.lastName}</p>
            }
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              required
            />
            {touched.email && formErrors.email && 
              <p className="error-message">{formErrors.email}</p>
            }
          </div>
        </div>

        {/* Contact Information */}
        <div className="input-group">
          <h3 className="section-title">Contact Details</h3>
          <div className="phone-input">
            <label>Phone</label>
            <div className="phone-parts">
              <input
                type="text"
                value={formData.Phone?.areaCode || ''}
                onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                onBlur={() => handleBlur('Phone')}
                maxLength={3}
                placeholder="000"
                required
              />
              <input
                type="text"
                value={formData.Phone?.prefix || ''}
                onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                onBlur={() => handleBlur('Phone')}
                maxLength={3}
                placeholder="000"
                required
              />
              <input
                type="text"
                value={formData.Phone?.lineNumber || ''}
                onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                onBlur={() => handleBlur('Phone')}
                maxLength={4}
                placeholder="0000"
                required
              />
            </div>
            {touched.Phone && formErrors.Phone && 
              <p className="error-message">{getErrorMessage(formErrors.Phone)}</p>
            }
          </div>
        </div>

        {/* Golf Information */}
        <div className="section-group">
          <h3 className="section-title">Golf Experience</h3>
          {storedUserType === "admin" && 
          (<div>
            <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
              Levels Teaching:
            </label>
            <div className="checkbox-grid">
              {Object.entries(GolfLevels)
                .filter(([key, value]) => isNaN(Number(key)) && Number(value) !== 7)
                .map(([label, value]) => (
                  <div key={value} className="checkbox-option">
                    <input
                      type="checkbox"
                      id={`level-${value}`}
                      name="level"
                      value={value}
                      checked={formData.level.includes(Number(value))}
                      onChange={(e) => handleCheckboxChange(e, Number(value))}
                      required
                    />
                    <label htmlFor={`level-${value}`}>
                      {label}
                    </label>
                  </div>
                ))}
            </div>
          </div>)
        }
          <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
            Teaching Certification:
          </label>
          <div className='new-instructor-quill'>
            <ReactQuill
              id="experience"
              placeholder="Experience and Certifications"
              value={formData?.golfExperience || ''} 
              onChange={handleQuillInputChange}
              style={{ height: "200px" }}
            />
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
                      onBlur={() => handleBlur('firstName')}
                      required
                    />
                    {touched.firstName && formErrors.firstName && 
                      <p className="error-message">{formErrors.firstName}</p>
                    }
                  </div>
                  <div className="input-group">
                    <label htmlFor="middleInitial">Middle Name</label>
                    <input
                      type="text"
                      id="middleInitial"
                      name="middleInitial"
                      value={formData.middleInitial || ''}
                      onChange={(e) => handleNameChange('middleInitial', e.target.value)}
                      onBlur={() => handleBlur('middleInitial')}
                    />
                    {touched.middleInitial && formErrors.middleInitial && 
                      <p className="error-message">{formErrors.middleInitial}</p>
                    }
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleNameChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      required
                    />
                    {touched.lastName && formErrors.lastName && 
                      <p className="error-message">{formErrors.lastName}</p>
                    }
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      required
                    />
                    {touched.email && formErrors.email && 
                      <p className="error-message">{formErrors.email}</p>
                    }
                  </div>
                </div>

                {/* Contact Information */}
                <div className="input-group">
                  <h3 className="section-title">Contact Details</h3>
                  <div className="phone-input">
                    <label>Phone</label>
                    <div className="phone-parts">
                      <input
                        type="text"
                        value={formData.Phone?.areaCode || ''}
                        onChange={(e) => handlePhoneChange('areaCode', e.target.value)}
                        onBlur={() => handleBlur('Phone')}
                        maxLength={3}
                        placeholder="000"
                        required
                      />
                      <input
                        type="text"
                        value={formData.Phone?.prefix || ''}
                        onChange={(e) => handlePhoneChange('prefix', e.target.value)}
                        onBlur={() => handleBlur('Phone')}
                        maxLength={3}
                        placeholder="000"
                        required
                      />
                      <input
                        type="text"
                        value={formData.Phone?.lineNumber || ''}
                        onChange={(e) => handlePhoneChange('lineNumber', e.target.value)}
                        onBlur={() => handleBlur('Phone')}
                        maxLength={4}
                        placeholder="0000"
                        required
                      />
                    </div>
                    {touched.Phone && formErrors.Phone && 
                      <p className="error-message">{getErrorMessage(formErrors.Phone)}</p>
                    }
                  </div>
                </div>

                {/* Instructor Information */}
                <div className="section-group">
                  <h3 className="section-title">Golf Experience</h3>
                  {storedUserType === "admin" && (
                  <div>
                    <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
                      Levels Teaching:
                    </label>
                    <div className="checkbox-grid">
                    {Object.entries(GolfLevels)
                      .filter(([key, value]) => isNaN(Number(key)) && Number(value) !== 7)
                      .map(([label, value]) => (
                        <div key={value} className="checkbox-option">
                          <input
                            type="checkbox"
                            id={`level-${value}`}
                            name="level"
                            value={value}
                            checked={formData.level.includes(Number(value))}
                            onChange={(e) => handleCheckboxChange(e, Number(value))}
                          />
                          <label htmlFor={`level-${value}`}>
                            {label}
                          </label>
                        </div>
                      ))}
                  </div>
                  </div>
                )}
                  
                  <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label htmlFor="golf-levels" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block', color: '#2e362e' }}>
                      Teaching Certification & Experience:
                    </label>
                    <div className='new-instructor-quill'>
                      <ReactQuill
                        id="experience"
                        placeholder="Enter your golf teaching certifications and experience..."
                        value={formData?.golfExperience || ''}
                        onChange={handleQuillInputChange}
                        style={{ height: "200px" }}
                      />
                    </div>
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
