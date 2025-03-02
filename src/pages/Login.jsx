import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const { signIn, signUp, resetPassword, error: authError, authInProgress, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear errors when switching modes
  useEffect(() => {
    clearError();
    setResetEmailSent(false);
  }, [isSignUp, forgotPassword, clearError]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (forgotPassword) {
        await resetPassword(email);
        setResetEmailSent(true);
      } else if (isSignUp) {
        await signUp(email, password, displayName);
        navigate('/');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Authentication error in component:', err);
    }
  };
  
  const renderForgotPasswordForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      
      {resetEmailSent && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
          If an account exists with this email, a password reset link has been sent.
          Please check your inbox and spam folder.
        </div>
      )}
      
      {authError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {authError}
        </div>
      )}
      
      <div>
        <button
          type="submit"
          disabled={authInProgress}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${authInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {authInProgress ? 'Sending...' : 'Reset Password'}
        </button>
      </div>
      
      <div className="text-center mt-4">
        <button
          type="button"
          className="font-medium text-blue-600 hover:text-blue-500"
          onClick={() => setForgotPassword(false)}
        >
          Back to sign in
        </button>
      </div>
    </form>
  );
  
  const renderAuthForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        {isSignUp && (
          <div>
            <label htmlFor="display-name" className="sr-only">Display Name</label>
            <input
              id="display-name"
              name="displayName"
              type="text"
              required={isSignUp}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isSignUp ? '' : 'rounded-t-md'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder={isSignUp ? 'Create password (6+ characters)' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>
      </div>
      
      {authError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {authError}
        </div>
      )}
      
      {!isSignUp && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="font-medium text-sm text-blue-600 hover:text-blue-500"
            onClick={() => setForgotPassword(true)}
          >
            Forgot your password?
          </button>
        </div>
      )}
      
      <div>
        <button
          type="submit"
          disabled={authInProgress}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${authInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {authInProgress ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </div>
    </form>
  );
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {forgotPassword 
              ? 'Reset your password' 
              : (isSignUp ? 'Create an account' : 'Sign in to your account')}
          </h2>
          
          {!forgotPassword && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {isSignUp 
                ? 'Already have an account? ' 
                : 'Don\'t have an account? '}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          )}
        </div>
        
        {forgotPassword ? renderForgotPasswordForm() : renderAuthForm()}
      </div>
    </div>
  );
};

export default Login; 