import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Get a document from Firestore
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} - Document data
 */
export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

/**
 * Get all documents from a collection
 * 
 * @param {string} collectionName - Collection name
 * @returns {Promise<Array>} - Array of documents
 */
export const getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Create or update a document in Firestore
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 * @returns {Promise<void>} - Promise that resolves when the operation is complete
 */
export const setDocument = (collectionName, docId, data) => {
  return setDoc(doc(db, collectionName, docId), data, { merge: true });
};

/**
 * Update a document in Firestore
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data to update
 * @returns {Promise<void>} - Promise that resolves when the operation is complete
 */
export const updateDocument = (collectionName, docId, data) => {
  return updateDoc(doc(db, collectionName, docId), data);
};

/**
 * Delete a document from Firestore
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<void>} - Promise that resolves when the operation is complete
 */
export const deleteDocument = (collectionName, docId) => {
  return deleteDoc(doc(db, collectionName, docId));
};

/**
 * Query documents from a collection
 * 
 * @param {string} collectionName - Collection name
 * @param {Array} conditions - Array of query conditions [field, operator, value]
 * @param {Array} orderByFields - Array of fields to order by
 * @param {number} limitCount - Number of documents to limit to
 * @returns {Promise<Array>} - Array of documents
 */
export const queryDocuments = async (collectionName, conditions = [], orderByFields = [], limitCount = 0) => {
  let q = collection(db, collectionName);
  
  // Add where conditions
  if (conditions.length > 0) {
    conditions.forEach(([field, operator, value]) => {
      q = query(q, where(field, operator, value));
    });
  }
  
  // Add orderBy
  if (orderByFields.length > 0) {
    orderByFields.forEach(field => {
      q = query(q, orderBy(field));
    });
  }
  
  // Add limit
  if (limitCount > 0) {
    q = query(q, limit(limitCount));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { db };
export default db;
