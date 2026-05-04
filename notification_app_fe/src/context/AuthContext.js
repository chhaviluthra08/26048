'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('auth_token');
    if (stored) setToken(stored);
  }, []);

  const login = (t) => {
    sessionStorage.setItem('auth_token', t);
    setToken(t);
  };

  const logout = () => {
    sessionStorage.removeItem('auth_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);