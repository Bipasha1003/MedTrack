import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

// Create a context — a global state anyone can read
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // When app loads, check if user was already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Called after successful Google login
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Called when user clicks logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — any component can call useAuth() to get user info
export const useAuth = () => useContext(AuthContext);