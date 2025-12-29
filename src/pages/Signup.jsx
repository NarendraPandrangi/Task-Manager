import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signupWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      setLoading(true);
      await signupWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          type="button" 
          onClick={handleGoogleSignUp} 
          disabled={loading}
          className="btn-google"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight: '8px'}}>
            <path fill="#4285F4" d="M16.51 8.44c0-.62-.05-1.22-.15-1.8H8.97v3.4h4.26c-.18 1-.74 1.86-1.58 2.43v2.01h2.56c1.5-1.38 2.34-3.41 2.34-5.82z"/>
            <path fill="#34A853" d="M8.97 17.5c2.14 0 3.94-.71 5.26-1.92l-2.56-2.01c-.71.48-1.62.77-2.7.77-2.07 0-3.83-1.4-4.46-3.29H1.85v2.07c1.3 2.59 3.98 4.38 7.12 4.38z"/>
            <path fill="#FBBC05" d="M4.51 10.6c-.13-.39-.2-.81-.2-1.24s.07-.85.2-1.24V5.29H1.85c-.53 1.06-.83 2.26-.83 3.71s.3 2.65.83 3.71l2.66-2.07z"/>
            <path fill="#EA4335" d="M8.97 3.9c1.17 0 2.22.4 3.05 1.18l2.28-2.28C12.91.99 11.11 0 8.97 0 5.83 0 2.15 1.79 1.85 4.38l2.66 2.07c.63-1.89 2.39-3.29 4.46-3.29z"/>
          </svg>
          Continue with Google
        </button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
