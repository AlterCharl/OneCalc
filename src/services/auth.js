import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Mock user storage
let currentUser = null;
const authStateListeners = [];

/**
 * Register an auth state change listener
 * 
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Function to unregister the listener
 */
export const onAuthChange = (callback) => {
  authStateListeners.push(callback);
  
  // Call the callback immediately with the current auth state
  setTimeout(() => {
    callback(currentUser, null);
  }, 0);
  
  // Return a function to unregister the listener
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index !== -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

/**
 * Notify all auth state listeners of a change
 */
const notifyAuthStateChange = (error = null) => {
  authStateListeners.forEach(listener => {
    try {
      listener(currentUser, error);
    } catch (err) {
      console.error('Error in auth state change listener:', err);
    }
  });
};

/**
 * Sign in with email and password
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - The signed in user
 */
export const signIn = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple email validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  // Simple password validation
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Simulate successful sign in
  currentUser = {
    uid: 'mock-user-123',
    email,
    displayName: email.split('@')[0],
    emailVerified: true
  };
  
  // Notify listeners
  notifyAuthStateChange();
  
  return currentUser;
};

/**
 * Sign up with email and password
 * 
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} - The newly created user
 */
export const signUp = async (email, password, displayName) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple email validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  // Simple password validation
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Simulate successful sign up
  currentUser = {
    uid: 'mock-user-' + Date.now(),
    email,
    displayName: displayName || email.split('@')[0],
    emailVerified: false
  };
  
  // Notify listeners
  notifyAuthStateChange();
  
  return currentUser;
};

/**
 * Log out the current user
 * 
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear current user
  currentUser = null;
  
  // Notify listeners
  notifyAuthStateChange();
};

/**
 * Send a password reset email
 * 
 * @param {string} email - Email address to send reset email to
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple email validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  // Simulate successful password reset email
  console.log(`Password reset email sent to ${email}`);
};

// For testing purposes, set an initial mock user
// Comment this out in production
currentUser = {
  uid: 'mock-user-initial',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true
};

// Initialize listeners with the mock user
setTimeout(() => {
  notifyAuthStateChange();
}, 100); 