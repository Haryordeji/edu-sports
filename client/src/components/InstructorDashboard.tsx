import React from 'react';
import { User } from 'lucide-react';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import { useParams } from 'react-router-dom';

const styles = {
  logo: {
    width: '200px',
    height: 'auto',
  },
};

const InstructorDashboard: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo" style={styles.logo}/>
        </div>
        <nav className="main-nav">
          <div className="nav-links">
            <a href={`/instructor/${id}/feedback`} className="nav-link">Feedback</a>
          </div>
          <div className="profile">
            <a href={`/profile/${id}`} className="profile">
            <User size={36} strokeWidth={3.5} />
            <span>Profile</span>
            </a>
          </div>
        </nav>
      </header>
      <main className="dashboard-main">
        <WeeklyCalendar />
      </main>
    </div>
  );
};

export default InstructorDashboard;