import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await registerUser(fullName, username, email, password);
      setSuccess(true);
      // Give the user a moment to see the success message,
      // then send them to log in with their new account.
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-brand">
      <div className="brand-logo">
        Secure<span>Doc</span>Chain
      </div>

      <div className="brand-content">
        <h2>
          Build a safer
          <br />
          <span>document trail.</span>
        </h2>

        <p>
          Manage documents, control access, and maintain
          tamper-evident records across every version.
        </p>
      </div>

      <div className="security-points">
        <div className="security-point">Encrypted Storage</div>
        <div className="security-point">Audit Ready</div>
        <div className="security-point">Version Tracking</div>
      </div>
    </div>

    <div className="auth-form-side">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1>Create account</h1>
          <p>Set up your SecureDocChain account.</p>
        </div>

        {success ? (
          <div className="success-message">
            Account created successfully! Redirecting to login...
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                className="form-input"
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-input"
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="form-input"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-input"
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  </div>
);
}

export default RegisterPage;