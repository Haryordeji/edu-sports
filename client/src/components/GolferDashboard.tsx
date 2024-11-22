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
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo"/>
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