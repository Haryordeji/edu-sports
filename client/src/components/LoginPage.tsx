/*
Please check the figma design to see how this component
should look like. The design is at 
https://www.figma.com/design/3GaHf9kOXKmxS60tpwqi6T/COS-333
*/
import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Please add the login logic here
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1>EDU SPORTS</h1>
          <p>The Sporting Chance to be More</p>
        </div>
        <h2>Login into Your Swing 2. Tee Golf Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
      </div>
      <div className="new-user-section">
        <h3>New Here?</h3>
        <p>Sign up and discover and have a sporting chance to be more</p>
        <button className="sign-up-button">Sign Up</button>
      </div>
    </div>
  );
};

export {LoginPage};