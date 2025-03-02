import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Import debug tools
import './debug';
import './debugModules';

// Set up global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Try to render an error message in the DOM if the main app fails
  const errorContainer = document.createElement('div');
  errorContainer.style.padding = '20px';
  errorContainer.style.margin = '20px';
  errorContainer.style.backgroundColor = '#ffebee';
  errorContainer.style.border = '1px solid #f44336';
  errorContainer.style.borderRadius = '4px';
  
  errorContainer.innerHTML = `
    <h2>Global Error Caught</h2>
    <p>${event.error?.message || 'Unknown error'}</p>
    <details>
      <summary>Stack Trace</summary>
      <pre>${event.error?.stack || 'No stack trace available'}</pre>
    </details>
    <p>Please check browser console for more details.</p>
  `;
  
  // Only append if the root element exists and is empty
  const rootElement = document.getElementById('root');
  if (rootElement && rootElement.childNodes.length === 0) {
    rootElement.appendChild(errorContainer);
  }
});

// Add debug information to window
window.debugInfo = {
  reactVersion: React.version,
  isDevelopment: process.env.NODE_ENV === 'development',
  startTime: new Date().toISOString()
};

console.log('%c OneCalc Debug Session Started', 'color: white; background-color: blue; font-size: 16px; padding: 5px;');
console.log('React version:', React.version);
console.log('Environment:', process.env.NODE_ENV);

// Use the older ReactDOM.render method for React <18
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 