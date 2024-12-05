import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import WeeklyCalendar from './WeeklyCalendar';
import './global.css';
import instance from '../utils/axios';
import ProfileDropdown from './ProfileDropdown';
import NewInstructorModal from './NewInstructorModal';
import ScheduleEditor from './ScheduleEditor';
import { GolfLevels } from '../interfaces';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  level: number[]
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'schedule');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const UserList = ({ userType, users }: { userType: string; users: User[] }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  
    const toggleCollapse = () => {
      setIsCollapsed((prev) => !prev);
    };
  
    // Group users by level
    const usersByLevel: { [key: string]: User[] } = users
      .filter((user) => user.user_type.toLowerCase() === userType.toLowerCase())
      .reduce((acc, user) => {
        user.level.forEach((lvl) => {
          const levelName = GolfLevels[lvl];
          if (!acc[levelName]) acc[levelName] = [];
          acc[levelName].push(user);
        });
        return acc;
      }, {} as { [key: string]: User[] });
  
      const totalCount = Object.values(usersByLevel).reduce((uniqueUsers, users) => {
        users.forEach((user) => uniqueUsers.add(user.user_id));
        return uniqueUsers;
      }, new Set<string>()).size;
      
  
    return (
      <div className="user-section">
        <div className="section-header">
          <div
            className="dropdown-header"
            onClick={() => toggleCollapse()}
          >
            <span>
              {userType}s ({totalCount})
            </span>
            <span className={`dropdown-toggle ${isCollapsed ? "" : "open"}`}>▼</span>
            {userType.toLowerCase() === "instructor" && !isCollapsed && (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalOpen();
                  }}
                  className="add-button"
                >
                  <span>+</span> Add New
                </button>
              </div>
            )}
          </div>
        </div>
  
        {!isCollapsed && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            {Object.entries(usersByLevel).map(([levelName, levelUsers]) => (
              <div key={levelName} style={{ marginLeft: "1rem" }}>
                <h3 style={{ marginBottom: "0.5rem", color: "#374151" }}>
                  {levelName}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {levelUsers.map((user) => (
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
                        ((e.currentTarget.style.boxShadow =
                          "0 2px 6px rgba(0, 0, 0, 0.15)"),
                        (e.currentTarget.style.backgroundColor = "#fafff2"))
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(0, 0, 0, 0.1)"),
                        (e.currentTarget.style.backgroundColor = "transparent"))
                      }
                    >
                      <div>
                        <span style={{ fontWeight: 500, color: "#111827" }}>
                          {user.first_name} {user.last_name}
                        </span>
                        <span
                          onClick={() =>
                            navigator.clipboard.writeText(user.email)
                          }
                          style={{
                            marginLeft: "1rem",
                            fontSize: "0.875rem",
                            color: "#6B7280",
                            cursor: "pointer",
                            transition: "color 0.2s ease-in-out",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "##0e5f04")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#6B7280")
                          }
                          title="Click to copy email"
                        >
                          {user.email} 🔗
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleViewUser(user.user_id)}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                            color: "#0e5f04",
                            border: "1px solid #0e5f04",
                            borderRadius: "0.375rem",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#B4E5AF")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          View Profile
                        </button>
                        {user.user_type.toLowerCase() === "golfer" && (
                          <button
                            onClick={() =>
                              navigate(`/feedback/${id}/${user.user_id}`)
                            }
                            style={{
                              padding: "0.5rem 1rem",
                              fontSize: "0.875rem",
                              color: "#0e5f04",
                              border: "1px solid #0e5f04",
                              borderRadius: "0.375rem",
                              backgroundColor: "transparent",
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "#B4E5AF")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            View Feedback
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                            color: "#DC2626",
                            border: "1px solid #DC2626",
                            borderRadius: "0.375rem",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FEE2E2")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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

  // Modal functions
  const handleModalOpen = () => setIsModalOpen(true); // Open modal
  const handleModalClose = () => setIsModalOpen(false); // Close modal

  const handleSuccess = () => {
    fetchUsers(); // Refresh user list after adding a new instructor
    handleModalClose(); // Close modal
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
          <Link to={`/admin/dashboard/${storedUserId}/?tab=schedule`}>
             <img src='/swing2tee_logo.png' alt="Swing 2 Tee Logo" />
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
              onClick={() => handleTabChange('schedule-editor')}
              className={`nav-link ${activeTab === 'schedule-editor' ? 'active' : ''}`}
            >
              Manage Schedule
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
              <UserList userType="Instructor" users={users} />
              <UserList userType="Golfer" users={users} />
              {error && (
                <div className="text-red-600 mt-4">
                  {error}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule-editor' && (
            <div>
              <ScheduleEditor />
            </div>
          )}
        </main>
      </div>
      {isModalOpen && <NewInstructorModal onClose={handleModalClose} onSuccess={handleSuccess} />}
    </div>
  );
};

export default AdminDashboard;