/*
Please check the figma design to see how this component
should look like. The design is at 
https://www.figma.com/design/3GaHf9kOXKmxS60tpwqi6T/COS-333
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import instance from '../utils/axios';
import { AxiosError } from 'axios';

interface LoginResponse {
  success: boolean;
  user: {
    user_id: string;
    email: string;
    user_type: string;
  };
  message: string;
  token: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await instance.post<LoginResponse>('/login', 
        { email, password },
        { 
          withCredentials: true
        }
      );

      const { data } = response;

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // Navigate based on user type
        switch (data.user.user_type) {
          case 'admin':
            navigate(`/admin/dashboard/${data.user.user_id}`);
            break;
          case 'instructor':
            navigate(`/instructor/dashboard/${data.user.user_id}`);
            break;
          case 'golfer':
            navigate(`/golfer/dashboard/${data.user.user_id}`);
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Login failed');
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="login-page-wrapper">
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
        <img src="/swing2tee_logo.png" alt="Swing 2 Tee Logo" />
        </div>
        <h2>Login into Your Swing 2 Tee Golf Account</h2>
        {/* !move this */}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
          <h3>Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
          <h3>Password</h3>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button
            type="submit"
            className="sign-in-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div className="new-user-section">
        <h3>New Here?</h3>
        <p>Sign up and discover and have a sporting chance to be more</p>
        <button onClick={handleSignUp} className="sign-up-button" disabled={isLoading}>Sign Up</button>
        <a href="/reset-password" onClick={(e) => {e.preventDefault(); navigate("/reset-password"); }} className="reset-password-link">
            Click here to reset password
        </a>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;