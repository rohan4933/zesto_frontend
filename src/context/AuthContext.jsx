import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zesto_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current token on mount
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async (authToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error verifying token:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success && data.token) {
      localStorage.setItem('zesto_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, message: data.message, user: data.user };
    }
    return { success: false, message: data.message || 'Login failed' };
  };

  const signup = async (name, email, password, phone, role = 'CUSTOMER') => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, role })
    });
    const data = await res.json();

    if (data.success && data.token) {
      localStorage.setItem('zesto_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, message: data.message, user: data.user };
    }
    return { success: false, message: data.message || 'Sign up failed' };
  };

  const logout = () => {
    localStorage.removeItem('zesto_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
