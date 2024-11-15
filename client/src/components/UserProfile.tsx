import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import instance from '../utils/axios';
import { RegistrationFormData } from '../interfaces';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>No profile data found</div>;
  }

  const formatPhone = (phone: any) => {
    if (!phone) return 'N/A';
    return `(${phone.areaCode}) ${phone.prefix}-${phone.lineNumber}`;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
            <button 
      onClick={() => navigate(-1)} 
      className="mb-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
    >
      ← Back
    </button>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p><strong>Name:</strong> {profile.firstName} {profile.middleInitial} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {formatPhone(profile.Phone)}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>Zip Code:</strong> {profile.zipCode}</p>
          <p><strong>Gender:</strong> {profile.gender || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {profile.dateOfBirth}</p>
          <p><strong>Height:</strong> {profile.height}</p>
          <p><strong>Handedness:</strong> {profile.handedness}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Golf Information</h2>
          <p><strong>Golf Experience:</strong> {profile.golfExperience}</p>
          <p><strong>Previous Lessons:</strong> {profile.previousLessons ? 'Yes' : 'No'}</p>
          <p><strong>Lesson Duration:</strong> {profile.lessonDuration}</p>
          <p><strong>Previous Instructor:</strong> {profile.previousInstructor}</p>
          <p><strong>Heard From:</strong> {profile.heardFrom.source}</p>
          {profile.heardFrom.name && (
            <p><strong>Referral Name:</strong> {profile.heardFrom.name}</p>
          )}

          <h2 className="text-xl font-semibold mt-6">Emergency Contact</h2>
          <p><strong>Name:</strong> {profile.emergencyContact?.name}</p>
          <p><strong>Phone:</strong> {formatPhone(profile.emergencyContact?.phone)}</p>
          <p><strong>Relationship:</strong> {profile.emergencyContact?.relationship}</p>

          <h2 className="text-xl font-semibold mt-6">Medical Information</h2>
          <p><strong>Physician:</strong> {profile.physician?.name}</p>
          <p><strong>Physician Phone:</strong> {formatPhone(profile.physician?.phone)}</p>
          <p><strong>Medical Information:</strong> {profile.medicalInformation}</p>
        </div>
      </div>
    </div>
  );
};

export {UserProfile};