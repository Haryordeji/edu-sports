import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import instance from '../utils/axios';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

const styles = {
  logo: {
    width: '200px',
    height: 'auto',
  },
};

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'schedule');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'academy') {
      fetchUsers();
    }
  }, [activeTab]); 

  const fetchUsers = async () => {
    try {
      const response = await instance.get<UsersResponse>('/users', 
        {withCredentials: true}
      );
      const {data} = response;

      if (data.success) {
        setUsers(data.users);
      } 
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const response = await instance.delete(`/users/${userId}`, {
          withCredentials: true
        });
        setUsers(users.filter(user => user.user_id !== userId));
      } catch (err) {
        setError('Error deleting user');
        console.error(err);
      }
    }
  };

  const handleViewUser = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const UserList = ({ userType, users }: { userType: string, users: User[] }) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">{userType}s</h2>
      <div className="space-y-2">
        {users
          .filter(user => user.user_type.toLowerCase() === userType.toLowerCase())
          .map(user => (
            <div 
              key={user.user_id} 
              className="flex items-center justify-between p-3 bg-white rounded shadow"
            >
              <div>
                <span className="font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <span className="ml-4 text-gray-600">
                  {user.email}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleViewUser(user.user_id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const handleTabChange = (tab: string) => {
    if (tab === 'schedule-editor') {
      navigate('/admin/schedule');
      return;
    }
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img 
            src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg " 
            alt="Company Logo" style={styles.logo}
          />
        </div>
        <nav className="main-nav">
          <div className="nav-links">
            <button 
              onClick={() => handleTabChange('schedule')}
              className={`nav-link ${activeTab === 'schedule' ? 'text-black' : 'text-gray-600'}`}
            >
              Schedule
            </button>
            <button 
              onClick={() => handleTabChange('schedule-editor')}
              className="nav-link text-gray-600 hover:text-black"
            >
              Edit Schedule
            </button>
            <button 
              onClick={() => handleTabChange('feedback')}
              className={`nav-link ${activeTab === 'feedback' ? 'text-black' : 'text-gray-600'}`}
            >
              Feedback
            </button>
            <button 
              onClick={() => handleTabChange('academy')}
              className={`nav-link ${activeTab === 'academy' ? 'text-black' : 'text-gray-600'}`}
            >
              Academy
            </button>
          </div>
        </nav>
      </header>

      <main className="dashboard-main">
        {activeTab === 'schedule' && (
          <WeeklyCalendar />
        )}

        {activeTab === 'academy' && (
          <div className="p-6 bg-white">
            <UserList userType="Instructor" users={users} />
            <UserList userType="Golfer" users={users} />
            {error && (
              <div className="text-red-600 mt-4">
                {error}
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="p-6 bg-white">
            <h2>Feedback</h2>
            <p>Feedback section coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;