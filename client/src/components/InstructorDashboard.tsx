import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import instance from '../utils/axios';
import Logout from './ProfileDropdown';
import ProfileDropdown from './ProfileDropdown';

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

const InstructorDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'schedule');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();


  const storedUserJson = localStorage.getItem('user');
  let storedUserId = ''
  let storedUserType = ''
  if (storedUserJson) {
    const storedUser = JSON.parse(storedUserJson);
    storedUserId = storedUser.user_id;
    storedUserType = storedUser.user_type
  }
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

  const handleViewUser = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const UserList = ({ userType, users }: { userType: string; users: User[] }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    const toggleCollapse = () => {
      setIsCollapsed((prev) => !prev);
    };
  
    const sortedUsers = [
      ...users.filter((user) => user.user_type.toLowerCase() === "golfer"),
      ...users.filter((user) => user.user_type.toLowerCase() !== "golfer"),
    ];
  
    return (
      <div style={{ marginBottom: "1rem", padding: "20px" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#1F2937",
            cursor: "pointer",
          }}
          onClick={toggleCollapse}
        >
          {userType}s
          <span style={{ marginLeft: "10px", fontSize: "1rem", color: "#6B7280" }}>
            {isCollapsed ? "▼" : "▲"}
          </span>
        </h2>
        {!isCollapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sortedUsers
              .filter((user) => user.user_type.toLowerCase() === userType.toLowerCase())
              .map((user) => (
                <div
                  key={user.user_id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #E5E7EB",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)")
                  }
                >
                  <div>
                    <span style={{ fontWeight: 500, color: "#111827" }}>
                      {user.first_name} {user.last_name}
                    </span>
                    <span
                      style={{
                        marginLeft: "1rem",
                        fontSize: "0.875rem",
                        color: "#6B7280",
                      }}
                    >
                      {user.email}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleViewUser(user.user_id)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "#2563EB",
                        border: "1px solid #2563EB",
                        borderRadius: "0.375rem",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#EFF6FF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      View Profile
                    </button>
                    {user.user_type.toLowerCase() === "golfer" && (
                      <button
                      onClick={() => navigate(`/feedback/${id}/${user.user_id}`)}
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.875rem",
                          color: "#2563EB",
                          border: "1px solid #2563EB",
                          borderRadius: "0.375rem",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#EFF6FF")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        View Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };
  
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
        <div className="logo" onClick={() => handleTabChange("schedule")}>
          <Link to={`/instructor/dashboard/${storedUserId}/?tab=schedule`}>
          <img src="/swing2tee_logo.png" alt="Swing 2 Tee Logo" />
          </Link>
        </div>
        <div>
          <ProfileDropdown user_id={storedUserId} user_type={storedUserType}  />
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
              onClick={() => handleTabChange('academy')}
              className={`nav-link ${activeTab === 'academy' ? 'active' : ''}`}
            >
              Academy
            </button>
          </div>
        </nav>
      </header>
      <div style={{paddingTop: "2rem"}}>
        <main className="dashboard-main">
          {activeTab === 'schedule' && (
            <WeeklyCalendar />
          )}

          {activeTab === 'academy' && (
            <div className="dashboard-container">
              <UserList userType="Golfer" users={users} />
              {error && (
                <div className="text-red-600 mt-4">
                  {error}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;