/**
 * Firebase Test Utility
 * 
 * This script tests various Firebase functionality to ensure proper configuration.
 * Run this with a Firebase emulator for testing, or against your actual Firebase
 * project with caution (it will create test data).
 */
import { auth } from '../services/firebase';
import { db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc 
} from 'firebase/firestore';

/**
 * Tests Firebase initialization
 */
export const testFirebaseInit = () => {
  console.log('Testing Firebase initialization...');
  
  if (auth && db) {
    console.log('✅ Firebase successfully initialized');
    return true;
  } else {
    console.error('❌ Firebase initialization failed');
    return false;
  }
};

/**
 * Tests Firebase Authentication
 * @param {string} email - Test email address
 * @param {string} password - Test password
 */
export const testAuthentication = async (email, password) => {
  console.log('Testing Firebase Authentication...');
  
  try {
    // Test user creation
    console.log('1. Testing user creation...');
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User creation successful');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        console.log('⚠️ User already exists, continuing with sign in test');
      } else {
        throw err;
      }
    }
    
    // Test sign out
    console.log('2. Testing sign out...');
    await signOut(auth);
    console.log('✅ Sign out successful');
    
    // Test sign in
    console.log('3. Testing sign in...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Sign in successful', userCredential.user.uid);
    
    return true;
  } catch (err) {
    console.error('❌ Authentication test failed:', err.message);
    return false;
  }
};

/**
 * Tests Firestore Database operations
 */
export const testFirestore = async () => {
  console.log('Testing Firestore Database...');
  
  if (!auth.currentUser) {
    console.error('❌ No authenticated user. Please run authentication test first.');
    return false;
  }
  
  const userId = auth.currentUser.uid;
  const testData = {
    name: 'Test Scenario',
    description: 'Created for Firebase testing',
    createdAt: new Date().toISOString(),
    testValue: Math.random()
  };
  
  try {
    // Test document creation
    console.log('1. Testing document creation...');
    const scenariosRef = collection(db, 'users', userId, 'scenarios');
    const newScenarioRef = doc(scenariosRef);
    await setDoc(newScenarioRef, testData);
    console.log('✅ Document creation successful:', newScenarioRef.id);
    
    // Test document retrieval
    console.log('2. Testing document retrieval...');
    const docSnap = await getDoc(newScenarioRef);
    if (docSnap.exists()) {
      console.log('✅ Document retrieval successful:', docSnap.data());
    } else {
      throw new Error('Document does not exist');
    }
    
    // Test query
    console.log('3. Testing query...');
    const q = query(scenariosRef, where('name', '==', 'Test Scenario'));
    const querySnapshot = await getDocs(q);
    console.log(`✅ Query returned ${querySnapshot.docs.length} documents`);
    
    // Test document deletion
    console.log('4. Testing document deletion...');
    await deleteDoc(newScenarioRef);
    console.log('✅ Document deletion successful');
    
    return true;
  } catch (err) {
    console.error('❌ Firestore test failed:', err.message);
    return false;
  }
};

/**
 * Runs all Firebase tests
 * @param {string} email - Test email address
 * @param {string} password - Test password
 */
export const runAllTests = async (email, password) => {
  console.log('==========================================');
  console.log('STARTING FIREBASE TESTS');
  console.log('==========================================');
  
  const initSuccess = testFirebaseInit();
  if (!initSuccess) return false;
  
  console.log('------------------------------------------');
  const authSuccess = await testAuthentication(email, password);
  if (!authSuccess) return false;
  
  console.log('------------------------------------------');
  const firestoreSuccess = await testFirestore();
  
  console.log('==========================================');
  console.log('FIREBASE TEST RESULTS:');
  console.log('Initialization:', initSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('Authentication:', authSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('Firestore:', firestoreSuccess ? '✅ PASS' : '❌ FAIL');
  console.log('==========================================');
  
  return initSuccess && authSuccess && firestoreSuccess;
};

export default {
  testFirebaseInit,
  testAuthentication,
  testFirestore,
  runAllTests
}; 