import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  user_id: string;
  user_type: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user_id, user_type }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // back to the login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user_id}`);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
        }}
      >
        <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>👤</span>
        <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>{user_type}</span>
      </div>

      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.375rem',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <button
            onClick={handleViewProfile}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem 1rem',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#111827',
              fontSize: '0.9rem',
            }}
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.5rem 1rem',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#DC2626',
              fontSize: '0.9rem',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;