import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create auth context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * 
 * Provides a simplified mock auth implementation
 */
export const AuthProvider = ({ children }) => {
  // State for authentication
  const [currentUser, setCurrentUser] = useState({ 
    uid: 'mock-user-1',
    email: 'user@example.com',
    displayName: 'Demo User'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simple auth functions
  const login = useCallback(() => {
    console.log('Mock login called');
    return Promise.resolve(currentUser);
  }, [currentUser]);
  
  const logout = useCallback(() => {
    console.log('Mock logout called');
    return Promise.resolve();
  }, []);
  
  // Provide context value
  const contextValue = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
  
  console.log('AuthProvider initialized with', contextValue);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 