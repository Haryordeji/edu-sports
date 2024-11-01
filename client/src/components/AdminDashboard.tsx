import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define interfaces for type safety
interface User {
  user_id: number;
  username: string;
  email: string;
  user_type: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [students, setStudents] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []); 

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users?user_type=golfer');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.filter((user: User) => user.user_type === 'golfer'));
    } catch (err) {
      setError('Error loading students');
      console.error(err);
    }
  };

  const handleDeleteStudent = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete student');
        setStudents(students.filter(student => student.user_id !== userId));
      } catch (err) {
        setError('Error deleting student');
        console.error(err);
      }
    }
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="flex justify-between items-center px-6 py-4">
          <img 
            src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" 
            alt="Edu Sports Logo" 
            className="h-12 w-auto"
          />
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded ${activeTab === 'schedule' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
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
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
            >
              Students
            </button>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-7 border-b">
              {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-medium border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="h-[600px] overflow-y-auto">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-7 border-b last:border-b-0">
                  {weekDays.map((day, index) => (
                    <div 
                      key={`${day}-${hour}`} 
                      className="p-2 border-r last:border-r-0 min-h-[100px]"
                    >
                      <div className="text-xs text-gray-500">
                        {`${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <div className="space-y-2">
              {students.map((student: User) => (
                <div 
                  key={student.user_id} 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="font-medium">{student.username}</span>
                    <span className="text-gray-500 ml-2">{student.email}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteStudent(student.user_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">Feedback</h2>
            <p className="text-gray-600 mt-4">Feedback section coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;