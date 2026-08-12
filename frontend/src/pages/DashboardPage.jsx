import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Log out</button>
      </div>

      {user && (
        <p>
          Logged in as <strong>{user.username}</strong> ({user.role || user.role_name})
        </p>
      )}

      <p style={{ marginTop: '24px' }}>Document list will go here (Frontend Phase 3).</p>
    </div>
  );
}

export default DashboardPage;