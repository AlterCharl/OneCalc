import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import firebaseConfig from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Sign in with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Create a new user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<UserCredential>} - Firebase user credential
 */
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 * 
 * @returns {Promise<void>} - Promise that resolves when sign out is complete
 */
export const logOut = () => {
  return signOut(auth);
};

/**
 * Subscribe to auth state changes
 * 
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default auth; 