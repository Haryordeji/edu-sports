import React, { useEffect, useState } from 'react';
import instance from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRequestMode, setIsRequestMode] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

 useEffect(() => {
    setIsRequestMode(!token);
  }, [token]);

  const handleRequestReset = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post('auth/request-reset', { email });
      setMessage('Password reset link sent to your email.');
    } catch (error:any) {
      setMessage(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e:any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await instance.post('auth/reset-password', {
        token,
        newPassword,
      });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error:any) {
      setMessage(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset">
      <h2>{isRequestMode ? 'Request Password Reset' : 'Reset Your Password'}</h2>
      {message && <p>{message}</p>}
      {isRequestMode ? (
        <form onSubmit={handleRequestReset}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
