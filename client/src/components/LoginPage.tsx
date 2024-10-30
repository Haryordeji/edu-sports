/*
Please check the figma design to see how this component
should look like. The design is at 
https://www.figma.com/design/3GaHf9kOXKmxS60tpwqi6T/COS-333
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

interface LoginResponse {
  success: boolean;
  user: {
    user_id: number;
    username: string;
    email: string;
    user_type: string;
  };
  message: string;
}

const styles = {
  logo: {
    width: '200px',
    height: 'auto',
  },
};

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
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        console.log(data.message)
        throw new Error('Login failed');
      }

      if (data.success) {
        console.log("successful login")
        // user data in local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // we will define various components here
        switch (data.user.user_type) {
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'instructor':
            window.location.href = '/instructor/dashboard';
            break;
          case 'golfer':
            window.location.href = '/golfer/dashboard';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
        <img src="https://static.wixstatic.com/media/09e86e_318df3ef05b647329554c64770b3fd61~mv2.jpg/v1/fill/w_658,h_226,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Edu%20Sports%20Logo_04-01.jpg" alt="Company Logo" style={styles.logo} />
        </div>
        <h2>Login into Your Swing 2. Tee Golf Account</h2>
        {/* !move this */}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
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
      </div>
    </div>
  );
};

export default LoginPage;
