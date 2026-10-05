import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User { id: string; email: string; first_name: string; last_name: string; role: string; }
interface AuthCtx { user: User | null; token: string | null; login: (e: string, p: string) => Promise<void>; logout: () => void; }

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,  setUser]  = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mm_token'));

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  async function login(email: string, password: string) {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('mm_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mm_token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
