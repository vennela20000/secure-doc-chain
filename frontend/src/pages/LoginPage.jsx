import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(username, password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      // err.response is axios's shape for a non-2xx response.
      // Fall back to a generic message if the server didn't send one.
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '360px', margin: '80px auto', padding: '24px' }}>
      <h1>SecureDocChain</h1>
      <h2>Log in</h2>

      <form onSubmit={handleSubmit}>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>
        )}

        <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px' }}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p style={{ marginTop: '16px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;