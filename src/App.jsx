import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import FirebaseTest from './pages/FirebaseTest';
import SchemaTablePage from './pages/SchemaTablePage';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Protected route component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/test-firebase" element={<FirebaseTest />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/schema" 
              element={
                <PrivateRoute>
                  <SchemaTablePage />
                </PrivateRoute>
              } 
            />
          </Routes>
          
          {/* Simple navigation for testing */}
          <div className="fixed bottom-4 right-4 flex gap-2">
            <Link 
              to="/" 
              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/schema" 
              className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Schema Table
            </Link>
            <Link 
              to="/test-firebase" 
              className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Test Firebase
            </Link>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App; 