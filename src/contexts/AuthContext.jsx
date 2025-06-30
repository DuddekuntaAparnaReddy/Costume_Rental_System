import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData.js';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Admin login with specific credentials
    if (email === 'pehennawa@gmail.com' && password === '12251523@aasg') {
      const adminUser = mockUsers.find(u => u.email === email);
      if (adminUser) {
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
    }
    
    // Regular user login
    const foundUser = mockUsers.find(u => u.email === email && u.role === 'user');
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const signup = (email, password, name, phone) => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      phone: phone || '',
      role: 'user'
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (updatedData) => {
    if (!user) return false;

    const updatedUser = { ...user, ...updatedData };
    
    // Update in mockUsers array
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};