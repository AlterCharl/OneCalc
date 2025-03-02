import { lazyLoadModule, lazyLoadPage } from '../utils/lazyLoad';

// Lazy-loaded pages
export const Dashboard = lazyLoadPage(() => import('../pages/Dashboard'));
export const Settings = lazyLoadPage(() => import('../pages/SettingsPage'));
export const Reports = lazyLoadPage(() => import('../pages/ReportsPage'));

// Lazy-loaded modules
export const EmployeeCostsModule = lazyLoadModule(() => import('./costs/EmployeeCostsModule'));
export const TransactionFeesModule = lazyLoadModule(() => import('./revenue/TransactionFeesModule'));

// Lazy-loaded Firebase services
export const FirebaseAuth = lazyLoadModule(() => import('../services/firebase/auth'));
export const FirebaseFirestore = lazyLoadModule(() => import('../services/firebase/firestore'));
export const FirebaseStorage = lazyLoadModule(() => import('../services/firebase/storage')); 