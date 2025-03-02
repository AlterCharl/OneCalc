import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage';
import firebaseConfig from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * 
 * @param {File} file - File to upload
 * @param {string} path - Storage path
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/**
 * Get a download URL for a file
 * 
 * @param {string} path - Storage path
 * @returns {Promise<string>} - Download URL
 */
export const getFileUrl = (path) => {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

/**
 * Delete a file from Firebase Storage
 * 
 * @param {string} path - Storage path
 * @returns {Promise<void>} - Promise that resolves when the operation is complete
 */
export const deleteFile = (path) => {
  const storageRef = ref(storage, path);
  return deleteObject(storageRef);
};

/**
 * List all files in a directory
 * 
 * @param {string} path - Storage path
 * @returns {Promise<Array>} - Array of file references
 */
export const listFiles = async (path) => {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  
  return Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url
      };
    })
  );
};

export { storage };
export default storage;
