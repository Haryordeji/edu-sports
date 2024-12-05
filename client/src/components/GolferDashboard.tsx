import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Logout from './ProfileDropdown';
import ProfileDropdown from './ProfileDropdown';

const GolferDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const storedUserJson = localStorage.getItem('user');
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'feedback');
  const navigate = useNavigate();
  let storedUserId = ''
  let storedUserType = ''
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true });
  };
  

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem", // optional: adjust padding for spacing
        }}
      >
        <div className="logo">
        <img src="/swing2tee_logo.png" alt="Swing 2 Tee Logo" />
        </div>
        <div className="profile">
          <ProfileDropdown user_id={storedUserId} user_type={storedUserType}  />
        </div>
      </div>
        <nav className="main-nav">
        <div className="nav-links">
            <button
              onClick={() => handleTabChange('feedback')}
              className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
            >
              Feedback
            </button>
          </div>
        </nav>
      </header>
      <main className="dashboard-main">
        <WeeklyCalendar />
      </main>
    </div>
  );
};

export default GolferDashboard;