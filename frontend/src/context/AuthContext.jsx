import { createContext, useContext, useState } from 'react';

// Holds the logged-in user's info (or null) and the functions to
// log in / log out, available to any component in the tree via useAuth().
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Starts as null - Frontend Phase 2 will hydrate this from a
  // stored token on app load, and set it properly on login.
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = { user, setUser, token, setToken };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components do useAuth() instead of
// useContext(AuthContext) everywhere - slightly cleaner call sites.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}