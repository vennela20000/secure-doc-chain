import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  // Tracks whether we're still checking for an existing session on app load,
  // so ProtectedRoute doesn't redirect to /login for a split second
  // before we've had a chance to check localStorage.
  const [loading, setLoading] = useState(true);

  // On first app load, if a token already exists in localStorage
  // (user refreshed the page, or came back later), verify it's
  // still valid and re-fetch their user info.
  useEffect(() => {
    async function hydrateSession() {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentUser();
        setUser(data.user);
        setToken(storedToken);
      } catch (err) {
        // Token expired or invalid - clear it out
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrateSession();
  }, []);

  function login(newToken, userData) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = { user, token, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}