import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/registerPage';
import AdminDashboard from './components/AdminDashboards';
import { UserProfile } from './components/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile/:id" element={<UserProfile />} />

      </Routes>
    </Router>
  );
};

export default App;