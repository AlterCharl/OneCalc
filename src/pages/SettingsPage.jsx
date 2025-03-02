import React from 'react';

/**
 * SettingsPage - Application settings and configuration
 */
const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
        <p className="text-gray-600 mb-6">
          Configure application settings and preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          
          <div className="border-b pb-4">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
            </label>
          </div>
          
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Display
            </label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>R (ZAR)</option>
              <option>$ (USD)</option>
              <option>€ (EUR)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-700 mb-2">Logged in as: <span className="font-medium">user@example.com</span></p>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Change Password
            </button>
          </div>
          
          <div>
            <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 