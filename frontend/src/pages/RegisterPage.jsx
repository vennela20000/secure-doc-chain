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
    <div style={{ maxWidth: '360px', margin: '80px auto', padding: '24px' }}>
      <h1>SecureDocChain</h1>
      <h2>Register</h2>

      {success ? (
        <p style={{ color: 'green' }}>Account created! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          {error && (
            <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>
          )}

          <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px' }}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '16px' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;