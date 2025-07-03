import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Validasi dasar
      if (!email.includes('@')) {
        message.error('Email harus mengandung karakter @');
        return { success: false, message: 'Email tidak valid' };
      }
      
      if (password.length < 6) {
        message.error('Password minimal 6 karakter');
        return { success: false, message: 'Password terlalu pendek' };
      }

      // Simulasi login berhasil
      const userData = {
        id: Date.now(),
        name: email.split('@')[0], // Menggunakan bagian sebelum @ sebagai nama
        email: email,
        role: email.toLowerCase() === 'admin@tendaku.com' ? 'admin' : 'user'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      message.success('Login berhasil!');
      return { success: true };
    } catch (error) {
      message.error('Login gagal: ' + (error.message || 'Terjadi kesalahan'));
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Validasi dasar
      if (!email.includes('@')) {
        message.error('Email harus mengandung karakter @');
        return { success: false, message: 'Email tidak valid' };
      }
      
      if (password.length < 6) {
        message.error('Password minimal 6 karakter');
        return { success: false, message: 'Password terlalu pendek' };
      }

      // Simulasi register berhasil
      const userData = {
        id: Date.now(),
        name: name,
        email: email,
        role: email.toLowerCase() === 'admin@tendaku.com' ? 'admin' : 'user'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      message.success('Registrasi berhasil! Silakan login.');
      return { success: true };
    } catch (error) {
      message.error('Registrasi gagal: ' + (error.message || 'Terjadi kesalahan'));
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    message.success('Logout berhasil!');
    window.location.href = '/';
  };

  const updateProfile = ({ name, password, photo }) => {
    setUser(prev => {
      const updatedUser = {
        ...prev,
        name: name !== undefined ? name : prev.name,
        password: password !== undefined ? password : prev.password,
        photo: photo !== undefined ? photo : prev.photo,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
    message.success('Profil berhasil diperbarui!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
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