import React, { useEffect, useState } from 'react';
import instance from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { validatePassword } from '../utils/validation';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRequestMode, setIsRequestMode] = useState(true);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    setIsRequestMode(!token);
  }, [token]);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post('auth/request-reset', { email });
      setMessage('Password reset link sent to your email.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = validatePassword(newPassword);
    if (!validationResult.isValid) {
      setPasswordError(validationResult.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordError('');
    setLoading(true);
    try {
      await instance.post('auth/reset-password', { token, newPassword });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset">
      <button className="back-button" onClick={() => navigate('/')}>  ← Back
      </button>
      <h2>{isRequestMode ? 'Request Password Reset' : 'Reset Your Password'}</h2>
      {message && <p>{message}</p>}
      {isRequestMode ? (
        <form onSubmit={handleRequestReset}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <label>New Password:</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <label>Confirm Password:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordError && <p className="error-message">{passwordError}</p>}
          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;