// Firebase Service Facade
/**
 * Firebase Service
 * 
 * This is a facade for Firebase services that uses code splitting
 * to reduce the initial bundle size. Each Firebase service is loaded
 * only when it's needed.
 */

import { FirebaseAuth, FirebaseFirestore, FirebaseStorage } from '../components/lazyComponents';

// Memoization for Firebase services
const memoizedServices = {
  authService: null,
  firestoreService: null,
  storageService: null
};

// Auth service
export const auth = {
  signIn: async (email, password) => {
    if (!memoizedServices.authService) {
      memoizedServices.authService = await FirebaseAuth;
    }
    return memoizedServices.authService.signIn(email, password);
  },
  
  signUp: async (email, password) => {
    if (!memoizedServices.authService) {
      memoizedServices.authService = await FirebaseAuth;
    }
    return memoizedServices.authService.signUp(email, password);
  },
  
  logOut: async () => {
    if (!memoizedServices.authService) {
      memoizedServices.authService = await FirebaseAuth;
    }
    return memoizedServices.authService.logOut();
  },
  
  subscribeToAuthChanges: async (callback) => {
    if (!memoizedServices.authService) {
      memoizedServices.authService = await FirebaseAuth;
    }
    return memoizedServices.authService.subscribeToAuthChanges(callback);
  },
  
  getCurrentUser: async () => {
    if (!memoizedServices.authService) {
      memoizedServices.authService = await FirebaseAuth;
    }
    return memoizedServices.authService.auth.currentUser;
  }
};

// Helper for loading firestore service
const getFirestoreService = async () => {
  if (!memoizedServices.firestoreService) {
    memoizedServices.firestoreService = await FirebaseFirestore;
  }
  return memoizedServices.firestoreService;
};

// Firestore service
export const firestore = {
  getDocument: async (collectionName, docId) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.getDocument(collectionName, docId);
  },
  
  getCollection: async (collectionName) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.getCollection(collectionName);
  },
  
  setDocument: async (collectionName, docId, data) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.setDocument(collectionName, docId, data);
  },
  
  updateDocument: async (collectionName, docId, data) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.updateDocument(collectionName, docId, data);
  },
  
  deleteDocument: async (collectionName, docId) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.deleteDocument(collectionName, docId);
  },
  
  queryDocuments: async (collectionName, conditions, orderByFields, limitCount) => {
    const firestoreService = await getFirestoreService();
    return firestoreService.queryDocuments(collectionName, conditions, orderByFields, limitCount);
  }
};

// Helper for loading storage service
const getStorageService = async () => {
  if (!memoizedServices.storageService) {
    memoizedServices.storageService = await FirebaseStorage;
  }
  return memoizedServices.storageService;
};

// Storage service
export const storage = {
  uploadFile: async (file, path) => {
    const storageService = await getStorageService();
    return storageService.uploadFile(file, path);
  },
  
  getDownloadURL: async (path) => {
    const storageService = await getStorageService();
    return storageService.getDownloadURL(path);
  },
  
  deleteFile: async (path) => {
    const storageService = await getStorageService();
    return storageService.deleteFile(path);
  },
  
  listAllFiles: async (path) => {
    const storageService = await getStorageService();
    return storageService.listAllFiles(path);
  }
};

export default {
  auth,
  firestore,
  storage
};
