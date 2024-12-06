import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { GolfLevels, RegistrationFormData } from '../interfaces';
import './global.css';
import DOMPurify from 'dompurify';

interface ProfileResponse {
  success: boolean;
  user: RegistrationFormData
}

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.get<ProfileResponse>(`/users/${id}`, {withCredentials: true});
        const {data} = response;
        setProfile(data.user);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProfile();
    }
  }, [id]);
  const formatPhone = (phone: any) => {
    if (!phone) return 'N/A';
    return `(${phone.areaCode}) ${phone.prefix}-${phone.lineNumber}`;
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await instance.delete(`/users/${id}`, {
          withCredentials: true
        });
        if (response.data.success) {
          localStorage.removeItem('user'); 
          localStorage.removeItem('token'); 
          navigate('/');
        }
      } catch (err) {
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!profile) {
    return <div className="error-state">No profile data found</div>;
  }
  const formatGolfLevels = (levels: number[]): string[] => {
    if(levels == null) {
      return []
    }
    return levels.map(level => GolfLevels[level] || "Invalid Level");
  };
  
  const formattedLevels = formatGolfLevels(profile.level);


  const storedUserJson = localStorage.getItem('user');
  let storedUserId = ''
  let storedUserType = ''
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type
  }

  const queryParams = new URLSearchParams(location.search);
  const src = queryParams.get('src'); 

  return (
    <div className="user-profile-wrapper">
      <div className="user-profile-container">
      <button
        onClick={() => navigate(new URLSearchParams(location.search).has('src') ? -2 : -1)}
        className="back-button">          
        ← Back
      </button>
        
        {(storedUserId === id || storedUserType === "admin") && (
          <button
            onClick={() => navigate(`/profile/${id}/edit`)} 
            className="back-button"
          >
            Edit Profile
          </button>
        )}

        <div className="profile-header">
          <h1>User Profile</h1>
        </div>

        <div className="profile-sections">
          {/* Personal Information Section */}
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="info-group">
              <div className="info-label">Name</div>
              <div className="info-value">
                {profile.firstName} {profile.middleInitial} {profile.lastName}
              </div>
            </div>

            <div className="info-group">
              <div className="info-label">Email</div>
              <div className="info-value">{profile.email}</div>
            </div>

            <div className="info-group">
              <div className="info-label">Phone</div>
              <div className="info-value">{formatPhone(profile.Phone)}</div>
            </div>
            {profile.user_type.toLowerCase() === "golfer" && (
              <div>
                <div className="info-group">
                  <div className="info-label">Address</div>
                  <div className="info-value">{profile.address}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">City</div>
                  <div className="info-value">{profile.city}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">State</div>
                  <div className="info-value">{profile.state}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">Zip Code</div>
                  <div className="info-value">{profile.zipCode}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">Gender</div>
                  <div className="info-value">{profile.gender || 'N/A'}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">Date of Birth</div>
                  <div className="info-value">{profile.dateOfBirth}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">Height</div>
                  <div className="info-value">{profile.height}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">Handedness</div>
                  <div className="info-value">{profile.handedness}</div>
                </div>
              </div>
          )}
          </div>
            {/* Golf and Medical Information Section */}
          {profile.user_type.toLowerCase() === "golfer" && (
            
              <div className="profile-section">
              <h2 className="section-title">Golf Information</h2>
              
              <div className="info-group">
                <div className="info-label">Golf Level</div>
                <div className="info-value"> {GolfLevels[profile.level?.[0]] || "unknown"}</div>            
            </div>
              <div className="info-group">
                <div className="info-label">Golf Experience</div>
                <div className="info-value">{profile.golfExperience}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Previous Lessons</div>
                <div className={profile.previousLessons ? 'status-yes' : 'status-no'}>
                  {profile.previousLessons ? 'Yes' : 'No'}
                </div>
              </div>

              {profile.previousLessons && (
                <>
                  <div className="info-group">
                    <div className="info-label">Lesson Duration</div>
                    <div className="info-value">{profile.lessonDuration}</div>
                  </div>

                  <div className="info-group">
                    <div className="info-label">Previous Instructor</div>
                    <div className="info-value">{profile.previousInstructor}</div>
                  </div>
                </>
              )}

              <div className="info-group">
                <div className="info-label">Heard From</div>
                <div className="info-value">{profile.heardFrom.source}</div>
              </div>

              {profile.heardFrom.name && (
                <div className="info-group">
                  <div className="info-label">Referral Name</div>
                  <div className="info-value">{profile.heardFrom.name}</div>
                </div>
              )}

              <h2 className="section-title">Emergency Contact</h2>
              
              <div className="info-group">
                <div className="info-label">Name</div>
                <div className="info-value">{profile.emergencyContact?.name}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Phone</div>
                <div className="info-value">
                  {formatPhone(profile.emergencyContact?.phone)}
                </div>
              </div>

              <div className="info-group">
                <div className="info-label">Relationship</div>
                <div className="info-value">{profile.emergencyContact?.relationship}</div>
              </div>

              <h2 className="section-title">Medical Information</h2>
              
              <div className="info-group">
                <div className="info-label">Physician</div>
                <div className="info-value">{profile.physician?.name}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Physician Phone</div>
                <div className="info-value">
                  {formatPhone(profile.physician?.phone)}
                </div>
              </div>

              <div className="info-group">
                <div className="info-label">Medical Information</div>
                <div
                  className="info-value"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(profile.medicalInformation || "None provided"),
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Instructor Information Section */}
          {(profile.user_type.toLowerCase() === "instructor" || profile.user_type.toLowerCase() === "admin") && (
                      
                    <div className="profile-section">
                      <h2 className="section-title">Instructor Information</h2>
                      
                      <div className="info-group">
                        <div className="info-label">Golf Certifications</div>
                        <div
                          className="info-value"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(profile.golfExperience),
                          }}
                        ></div>
                      </div>

                      <div className="info-group">
                        <div className="info-label">Levels Teaching</div>
                        <div className="info-value">
                        <ul>
                          {formattedLevels.map((level, index) => (
                            <li key={index}>{level}</li>
                          ))}
                        </ul>
                        </div>
                      </div>
                    </div>
                  )}
        </div>

        {/* Delete Account Section */}
        {(profile.user_type === "golfer" || profile.user_type === "instructor") && storedUserId === id && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <button
              onClick={handleDeleteAccount}
              className="delete-button"
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { UserProfile };