import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/endpoints';
import { tokenStore } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.me();
      setUser(data.user);
      setStudent(data.student || null);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    tokenStore.set(data.token);
    setUser(data.user);
    // Pull the full session (includes student profile) right after login.
    const session = await authApi.me();
    setStudent(session.student || null);
    return data.user;
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    setStudent(null);
  };

  const refreshStudent = (next) => setStudent(next);

  return (
    <AuthContext.Provider
      value={{ user, student, loading, login, logout, refreshStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
