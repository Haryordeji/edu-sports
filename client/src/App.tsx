import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/registerPage';
import AdminDashboard from './components/AdminDashboards';
import { UserProfile } from './components/UserProfile';
import GolferDashboard from './components/GolferDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import ScheduleEditor from './components/ScheduleEditor';
import EditProfile  from './components/EditProfile';
import FeedbackManager from './components/FeedbackManager';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
        <Route path="/admin/schedule" element={<ScheduleEditor />} />
        <Route path="/golfer/dashboard/:golfer_id" element={<GolferDashboard/>} />
        <Route path="/instructor/dashboard/:id" element={<InstructorDashboard/>} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/profile/:id/edit" element={<EditProfile />} />
        <Route path="/feedback/:instructor_id/:golfer_id" element={<FeedbackManager/>}/>

      </Routes>
    </Router>
  );
};

export default App;