import { UUID } from 'crypto';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  user_id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [users, setUsers] = useState<User[]>([]);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []); 

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

        if (data.success) {
        setUsers(data.users);
        } 
    } catch (err) {
      setError('Error loading students');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(`Are you sure you delete this account?`)) {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete user ${userId}`);
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


  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

  return (
    <div >
      {/* Header */}
      <header>
        <div>
          <img 
            src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" 
            alt="Edu Sports Logo" 
          />
          <div>
            <button 
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 rounded ${activeTab === 'feedback' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            >
              Feedback
            </button>
            <button 
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'schedule' && (
          <div>
            <div>
              {weekDays.map(day => (
                <div key={day} >
                  {day}
                </div>
              ))}
            </div>
            <div>
              {hours.map(hour => (
                <div key={hour} >
                  {weekDays.map((day, index) => (
                    <div 
                      key={`${day}-${hour}`} 
                    >
                      <div>
                        {`${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
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
          <div>
            <h2>Feedback</h2>
            <p >Feedback section coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;