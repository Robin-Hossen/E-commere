/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const username = localStorage.getItem('username') || '';
    // Recover the is_staff claim from the JWT payload.
    let isStaff = localStorage.getItem('is_staff') === 'true';
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      isStaff = Boolean(payload.is_staff);
      localStorage.setItem('is_staff', String(isStaff));
    } catch {
      /* keep fallback */
    }
    return { token, username, isStaff };
  });
  const loading = false;

  const login = async (username, password) => {
    const response = await axiosInstance.post('token/', { username, password });
    const { access, refresh } = response.data;

    // Decode the access token to read the is_staff claim.
    let isStaff;
    try {
      const payload = JSON.parse(atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      isStaff = Boolean(payload.is_staff);
    } catch {
      isStaff = false;
    }

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('username', username);
    localStorage.setItem('is_staff', String(isStaff));
    setUser({ username, access, isStaff });
    return response;
  };

  const register = async (userData) => {
    // userData = { username, email, password, confirm_password, first_name, last_name }
    return await axiosInstance.post('users/', userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_staff');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};