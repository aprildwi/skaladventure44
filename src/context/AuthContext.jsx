// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // User data untuk login
  const users = [
    {
      id: 1,
      email: 'user@example.com',
      password: 'user123',
      name: 'John Adventurer',
      role: 'user',
      phone: '+62 812 3456 7890',
      address: 'Jl. Adventure No. 123, Tangerang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    {
      id: 2,
      email: 'admin@skaladventure.com',
      password: 'admin123',
      name: 'Admin Adventure',
      role: 'admin',
      phone: '+62 821 0987 6543',
      address: 'Head Office, Tangerang',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    }
  ];

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('skaladventure_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => 
          u.email === email && u.password === password
        );
        
        if (foundUser) {
          const userData = { 
            ...foundUser, 
            password: undefined 
          };
          setUser(userData);
          setIsAdmin(foundUser.role === 'admin');
          localStorage.setItem('skaladventure_user', JSON.stringify(userData));
          resolve({ success: true, user: userData });
        } else {
          reject(new Error('Email atau password salah'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('skaladventure_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('skaladventure_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};