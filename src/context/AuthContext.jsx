import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Login gagal');

      const data = await response.json();
      const { access_token, user: userData } = data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      message.success('Login berhasil!');
      return { success: true };
    } catch (err) {
      console.error(err);
      message.error('Email atau password salah!');
      return { success: false };
    }
  };

  const register = async (name, username, password) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('/api/v1/user/create', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Registrasi gagal');

      message.success('Registrasi berhasil! Silakan login.');
      return { success: true };
    } catch (err) {
      console.error(err);
      message.error('Registrasi gagal');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    message.success('Logout berhasil!');
    window.location.href = '/';
  };

  const updateProfile = ({ name, password, photo }) => {
    setUser(prev => {
      const updatedUser = {
        ...prev,
        name: name ?? prev.name,
        password: password ?? prev.password,
        photo: photo ?? prev.photo
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
    message.success('Profil berhasil diperbarui!');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
