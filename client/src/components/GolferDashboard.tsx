import React from 'react';
import { User } from 'lucide-react';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import { useParams } from 'react-router-dom';
import Logout from './ProfileDropdown';
import ProfileDropdown from './ProfileDropdown';

const GolferDashboard: React.FC = () => {
  const { id } = useParams();
  const storedUserJson = localStorage.getItem('user');
  let storedUserId = ''
  let storedUserType = ''
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
        <img src="/swing2tee_logo.png" alt="Swing 2 Tee Logo" />
        </div>
        <div className="profile">
          <ProfileDropdown user_id={storedUserId} user_type={storedUserType}  />
        </div>
        <nav className="main-nav">
          <div className="nav-links">
            <a href="/feedback" className="nav-link">Feedback</a>
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