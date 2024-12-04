import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerPage.css';
import { RegistrationFormData } from '../interfaces';
import instance from '../utils/axios';

const styles = {
  logo: {
    width: 'auto',
    height: '80px',
  },
};

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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
    agreeToTerms: false,
    user_type: 'golfer'
  }
);

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
    const response = await instance.post('/register', formData, {
      withCredentials: true,
    });
    const {data} = response;
    console.log('Registration successful:', data);
    setShowSuccessPopup(true);
    
    // redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  } catch (error) {
    console.error('Registration failed:', error);
  } 
};

const SuccessPopup = () => (
  <div className="popup-overlay">
    <div className="popup-content">
      <div className="success-icon">✓</div>
      <h2>Registration Successful!</h2>
      <p>Your account has been created successfully.</p>
      <p>You will be redirected to the login page in a moment.</p>
      <p>Please use your email and password to sign in.</p>
    </div>
  </div>
);

  const renderCreateAccount = () => (
    <>
      <h3>Create Your Account</h3>
      <p className="section-description">
        Welcome to Edu-Sports Academy! To begin your registration, please create your account credentials. 
        You will use these to log in and access your profile after registration.
      </p>
      
      <div className="account-creation-group">
        <div className="input-group">
          <h4>Email</h4>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="input-group">
          <h4>Password</h4>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <p className="input-hint">Password must be at least 8 characters long</p>
        </div>
      </div>
    </>
  );

  const renderPersonalInfo = () => (
    <>
      <div className="name-group">
        <div className="input-group">
          <h4>Last Name</h4>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <h4>First Name</h4>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group small">
          <h4>Middle Name Initial</h4>
          <input
            type="text"
            name="middleInitial"
            value={formData.middleInitial}
            onChange={handleInputChange}
            maxLength={1}
          />
        </div>
      </div>

      <div className="personal-info-group">
        <div className="gender-group">
          <h4>Gender</h4>
          <div className="radio-options">
            {['male', 'female', 'other'].map((gender) => (
              <label key={gender}>
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

        <div className="age-dob-group">
          <div className="input-group">
            <h4>Date of Birth</h4>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <h4>Height</h4>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="5'10''"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderContactInfo = () => (
    <>
      <div className="address-group">
        <div className="input-group">
          <h4>Address</h4>
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
            <h4>City</h4>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group small">
            <h4>State</h4>
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
            <h4>Zip Code</h4>
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

      <div className="contact-group">
        <div className="phone-input">
          <h4>Phone</h4>
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
    </>
  );

  const renderGolfExperience = () => (
    <>
      <div className="golf-experience-group">
        <h4>Golf Experience</h4>
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
                onChange={handleInputChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="handedness-group">
        <h4>Handedness</h4>
        <div className="radio-options">
          <label>
            <input
              type="radio"
              name="handedness"
              value="right"
              checked={formData.handedness === 'right'}
              onChange={handleInputChange}
            />
            Right Handed
          </label>
          <label>
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

      <div className="previous-lessons-group">
        <h4>Any previous golf lessons?</h4>
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

      <div className="heard-from-group">
        <h4>How did you hear about our program?</h4>
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
          {formData.heardFrom.source === 'friend' && (
            <input
              type="text"
              name="heardFromName"
              value={formData.heardFrom.name}
              onChange={(e) => handleInputChange(e, 'heardFrom', 'name')}
              placeholder="(Name)"
            />
          )}
        </div>
      </div>
    </>
  );

  const renderMedicalInfo = () => (
    <>
      <div className="emergency-section">
        <h3>EMERGENCY CONTACT - (Other than Participant/Parent/Legal Guardian)</h3>
        <div className="emergency-contact-group">
              <div className="input-group">
                <h4>Name</h4>
                <input
                  type="text"
                  name="name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange(e, 'emergencyContact', 'name')}
                  required
                />
              </div>
              
              <div className="phone-input">
                <h4>Phone </h4>
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
                <h4>Relationship</h4>
                <input
                  type="text"
                  name="relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange(e, 'emergencyContact', 'relationship')}
                  required
                />
              </div>
        </div>
      </div>

        {/* Physician Information */}
        <div className="physician-group">
              <div className="input-group">
                <h4>Physician's Name</h4>
                <input
                  type="text"
                  name="name"
                  value={formData.physician.name}
                  onChange={(e) => handleInputChange(e, 'physician', 'name')}
                  required
                />
              </div>

              <div className="phone-input">
                <h4>Phone</h4>
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

      <div className="medical-info-group">
        <h4>Relevant Medical Information</h4>
        <textarea
          name="medicalInformation"
          value={formData.medicalInformation}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
    </>
  );

  const renderReview = () => (
    <>
      <h3>Release & Waiver of Liability</h3>
      <div className="terms-agreement">
        <p>
        <b>PARTICIPATION:</b> In consideration of participating in Edu-Sports Academy, Swing 2 Tee Golf program,
        I represent that I understand the nature of the program and that I (and/or my minor child) agree
        to observe and abide by the rules of Edu-Sports Academy, Swing 2 Tee Golf and that I (and/or my minor child)
        am (are/is) qualified, in good health and in proper physical condition to participate in this program.
        I fully understand the program involves risks of serious bodily injury which may be caused by my own actions
        or inactions, the actions of others participating in the program, or by conditions in which the program 
       takes place. I fully accept and assume all such risks and all responsibility for loses, costs, and/or 
       damages I (and/or my minor child) may incur as a result and will discontinue participation immediately.
       <br></br>
       <br></br>
      <b>CONSENT TO TREATMENT:</b> I authorize such physician or medical stafWf as Edu-Sports Academy, Swing 2 Tee Golf
      program may designate to carry out any minor medical or surgical treatment and/or medication necessary, 
      or take the above-named partner to the emergency room of the nearest hospital, and I further authorize
      the hospital and its medical staff to provide treatment deemed necessary by them for the well-being of
      such partner. It is understood, however, that if hospitalization or treatment of a serious nature is
      required, the parent/guardian/emergency contact will be contacted, if possible.
      <br></br>
      <br></br>
    <b>RELEASE OF CLAIM:</b> I (and/or my minor child) release, indemnify, covenant not to sue, and hold harmless
    Edu-Sports Academy, Swing 2 Tee Golf, its administrators, directors, agents, officers, volunteers,
    employees, and other affiliated participants, sponsors, advertisers, and if applicable, any owners
    and lessors of premises on which the activity takes place from all liability, any losses, claims
    (other than that of the medical accident benefit), demands, costs, or damages that I (and/or my minor child)
    may incur as a results of participation in Edu-Sports Academy, Swing 2 Tee program and further agree that if,
    despite the “Release and Waiver of Liability” agreement, I or anyone on my behalf makes a claim against any
    of the Releasees, I will indemnify, save, and hold harmless each of the Releasees from any litigation expenses,
    attorney fees, loss, liability, damage of cost which may incur as a result of such action.
    <br></br>
    <br></br>
   <b>PERMISSION TO PUBLISH:</b> I grant Edu-Sports Academy, Swing 2 Tee Golf use my likeness, voice, and words in
  television, radio, film, or any other media to promote the activities of Edu-Sports Academy, Swing 2 Tee Golf.
        </p>
        <h5>
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
            required
          />
          By Marking this box, you to agree with the terms of our Release & Waiver of Liability
        </h5>
      </div>
    </>
  );
  return (
    <div className="register-page-wrapper">
      {showSuccessPopup && <SuccessPopup />}
      <div className="progress-sidebar">
        <img 
             src="/swing2tee_logo.png" alt="Swing 2 Tee Logo"
            style={styles.logo} 
            onClick={() => navigate('/')} 
          />
        <h2 className="progress-title">Your Progress</h2>
        <ul className="progress-list">
        <li 
            className={`progress-item ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => currentStep >= 1 && setCurrentStep(1)}
            >
            <span className="progress-indicator">✓</span>
            Create Account
          </li>
          <li 
            className={`progress-item ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => currentStep >= 2 && setCurrentStep(2)}
          >
            <span className="progress-indicator">✓</span>
            Personal Information
          </li>
          <li 
            className={`progress-item ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => currentStep >= 3 && setCurrentStep(3)}
          >
            <span className="progress-indicator">✓</span>
            Contact Details
          </li>
          <li 
            className={`progress-item ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}
            onClick={() => currentStep >= 4 && setCurrentStep(4)}
          >
            <span className="progress-indicator">✓</span>
            Golf Experience
          </li>
          <li 
            className={`progress-item ${currentStep >= 5 ? 'completed' : ''} ${currentStep === 5 ? 'active' : ''}`}
            onClick={() => currentStep >= 5 && setCurrentStep(5)}
          >
            <span className="progress-indicator">✓</span>
            Medical Information
          </li>
          <li 
            className={`progress-item ${currentStep >= 6 ? 'completed' : ''} ${currentStep === 6 ? 'active' : ''}`}
            onClick={() => currentStep >= 6 && setCurrentStep(6)}
          >
            <span className="progress-indicator">✓</span>
            Review Terms & Submit
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="form-section">
          
          <div className="required-field-note">* Required fields</div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderCreateAccount()}
            {currentStep === 2 && renderPersonalInfo()}
            {currentStep === 3 && renderContactInfo()}
            {currentStep === 4 && renderGolfExperience()}
            {currentStep === 5 && renderMedicalInfo()}
            {currentStep === 6 && renderReview()}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="nav-button back-button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Back
                </button>
              )}
              
              {currentStep < 6 ? (
                <button 
                  type="button" 
                  className="nav-button next-button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="nav-button next-button"
                  disabled={!formData.agreeToTerms}
                >
                  Submit Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;