import React, { useState } from 'react';
import { runAllTests, testFirebaseInit, testAuthentication, testFirestore } from '../utils/testFirebase';

const FirebaseTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Override console.log to capture logs
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  const setupConsoleCapture = () => {
    console.log = (...args) => {
      setLogs(prev => [...prev, { type: 'log', message: args.join(' ') }]);
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      setLogs(prev => [...prev, { type: 'error', message: args.join(' ') }]);
      originalConsoleError(...args);
    };
  };
  
  const restoreConsole = () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  };
  
  const runTest = async (testFunction, ...args) => {
    setLoading(true);
    setLogs([]);
    setupConsoleCapture();
    
    try {
      await testFunction(...args);
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      restoreConsole();
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Test Suite</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="test@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              A real user will be created with this email for testing
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Password for the test user"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => runTest(testFirebaseInit)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Test Initialization
          </button>
          
          <button
            onClick={() => runTest(testAuthentication, email, password)}
            disabled={loading || !email || !password}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Test Authentication
          </button>
          
          <button
            onClick={() => runTest(testFirestore)}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Test Firestore
          </button>
          
          <button
            onClick={() => runTest(runAllTests, email, password)}
            disabled={loading || !email || !password}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Run All Tests
          </button>
        </div>
      </div>
      
      <div className="bg-black rounded-lg p-4 overflow-auto" style={{ maxHeight: '500px' }}>
        <h2 className="text-xl font-semibold mb-2 text-white">Test Logs</h2>
        
        <div className="font-mono text-sm text-white">
          {logs.length === 0 ? (
            <div className="text-gray-500 italic">Run a test to see logs...</div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`${log.type === 'error' ? 'text-red-400' : 'text-green-300'} mb-1`}
              >
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> These tests will create real data in your Firebase project. 
          Use test accounts only. For a safer testing environment, consider setting up 
          Firebase emulators.
        </p>
      </div>
    </div>
  );
};

export default FirebaseTest; 