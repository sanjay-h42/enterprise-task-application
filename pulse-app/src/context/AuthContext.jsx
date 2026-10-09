// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'manager@pulse.io': {
    id: 1,
    name: 'Sanjay Mehta',
    email: 'manager@pulse.io',
    role: 'MANAGER',
    department: 'Engineering',
    avatar: 'SM',
    title: 'Engineering Manager',
    employeeId: 'EMP-1001',
  },
  'admin@pulse.io': {
    id: 2,
    name: 'Priya Agarwal',
    email: 'admin@pulse.io',
    role: 'ADMIN',
    department: 'HR',
    avatar: 'PA',
    title: 'HR Director',
    employeeId: 'EMP-1002',
  },
  'employee@pulse.io': {
    id: 3,
    name: 'Ananya Sharma',
    email: 'employee@pulse.io',
    role: 'EMPLOYEE',
    department: 'Engineering',
    avatar: 'AS',
    title: 'Senior Software Engineer',
    employeeId: 'EMP-1042',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pulse_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 900));

      const demoUser = DEMO_USERS[email.toLowerCase()];
      if (!demoUser || password.length < 3) {
        throw new Error('Invalid credentials. Use any demo account.');
      }

      const token = `mock-jwt-${demoUser.role}-${Date.now()}`;
      localStorage.setItem('pulse_token', token);
      localStorage.setItem('pulse_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles) => {
    return user && roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), loading, error, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
