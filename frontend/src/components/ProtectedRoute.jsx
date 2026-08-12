import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // Still checking localStorage/verifying the token - don't redirect yet,
  // or a logged-in user gets bounced to /login for a split second on refresh.
  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '80px' }}>Loading...</p>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;