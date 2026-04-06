import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.requires2FA) {
      return data;
    }
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const verify2FA = async (email, otp) => {
    const { data } = await api.post('/auth/verify-2fa', { email, otp });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.requiresOTP) {
      return data;
    }
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const verifyRegistration = async (email, otp) => {
    const { data } = await api.post('/auth/verify-registration', { email, otp });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const toggle2FA = async () => {
    const { data } = await api.put('/auth/profile/2fa');
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const isAdmin = () => user?.role === 'admin';
  const isSeller = () => user?.role === 'seller';

  return (
    <AuthContext.Provider value={{ user, loading, login, verify2FA, register, verifyRegistration, logout, toggle2FA, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
};
