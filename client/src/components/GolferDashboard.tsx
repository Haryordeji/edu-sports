import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import GolferFeedbackManager from './GolferFeedbackManager';

const GolferDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const storedUserJson = localStorage.getItem('user');
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'schedule');
  const navigate = useNavigate();
  
  let storedUserId = '';
  let storedUserType = '';
  let storedUserLevel = [] as number [];
  if (storedUserJson) {
    console.log(storedUserJson)
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type;
    storedUserLevel = storedUser.level;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`); // Update the URL query parameter
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem', 
          }}
        >
          <div className="logo">
            <img src="/swing2tee_logo.png" alt="Swing 2 Tee Logo" />
          </div>
          <div className="profile">
            <ProfileDropdown user_id={storedUserId} user_type={storedUserType} />
          </div>
        </div>
        <nav className="main-nav">
          <div className="nav-links">
          <button
              onClick={() => handleTabChange('schedule')}
              className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
            >
              Schedule
            </button>
            <button
              onClick={() => handleTabChange('feedback')}
              className={`nav-link ${activeTab === 'feedback' ? 'active' : ''}`}
            >
              Feedback
            </button>
          </div>
        </nav>
      </header>
      <main className="dashboard-main" style={{paddingTop: '0.5rem', paddingRight: '0.3rem', paddingLeft: '0.3rem'}}>
        {activeTab === 'feedback' && <GolferFeedbackManager />}
        {activeTab === 'schedule' && <WeeklyCalendar levelProp={storedUserLevel}/>}
      </main>
    </div>
  );
};

export default GolferDashboard;
