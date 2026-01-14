// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogIn, FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  const handleDemoLogin = (role) => {
    if (role === 'user') {
      setEmail('user@example.com');
      setPassword('user123');
    } else {
      setEmail('admin@skaladventure.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
            <button 
            className="login-back-btn"
            onClick={handleBack}
            disabled={loading}
            aria-label="Go back"
            >
                <FiArrowLeft /> Back
            </button>

          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">SA</span>
              <div>
                <h2>SkalAdventure</h2>
                <p>Welcome back! Please sign in</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <FiLock /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;