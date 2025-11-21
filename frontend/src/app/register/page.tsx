'use client';

import { useState, useEffect } from 'react';
import { usePlayerRegistration } from '@/hooks/useContract';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const { 
    isRegistered, 
    registerUsername, 
    registerIsLoading, 
    registerIsSuccess,
    registerIsError,
    registerError,
    refetchPlayerInfo,
  } = usePlayerRegistration();

  // Redirect if already registered
  useEffect(() => {
    if (isRegistered) {
      router.push('/play');
    }
  }, [isRegistered, router]);

  // Redirect on successful registration
  useEffect(() => {
    if (registerIsSuccess) {
      toast.success('Registration successful! 🎉');
      // Refetch player info to update isRegistered status
      refetchPlayerInfo();
      setTimeout(() => {
        router.push('/play');
      }, 2000);
    }
  }, [registerIsSuccess, router, refetchPlayerInfo]);

  // Show error toast
  useEffect(() => {
    if (registerIsError && registerError) {
      toast.error(registerError.message || 'Registration failed. Please try again.');
    }
  }, [registerIsError, registerError]);

  const validateUsername = (value: string): boolean => {
    setError('');
    
    if (value.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    if (value.length > 20) {
      setError('Username must be less than 20 characters');
      return false;
    }
    
    // Check alphanumeric and underscore only
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(value)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      validateUsername(value);
    } else {
      setError('');
    }
  };

  const handleRegister = async () => {
    if (!validateUsername(username)) {
      return;
    }
    
    try {
      toast.loading('Registering username... Please confirm the transaction', {
        duration: 60000,
      });
      registerUsername(username);
    } catch (err) {
      console.error('Registration error:', err);
      toast.dismiss();
      toast.error('Failed to register. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Connect Your Wallet
          </h1>
          <p className="text-center text-gray-600">
            Please connect your wallet to register
          </p>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Already Registered!
            </h1>
            <p className="text-gray-600 mb-6">
              Redirecting to play...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Register Username
          </h1>
          <p className="text-gray-600">
            Choose a unique username to start playing
          </p>
        </div>

        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter username (3-20 characters)"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              minLength={3}
              maxLength={20}
              disabled={registerIsLoading}
            />
            
            {/* Character count */}
            <div className="mt-1 text-sm text-gray-500 text-right">
              {username.length}/20 characters
            </div>
            
            {/* Error message */}
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            
            {/* Contract error */}
            {registerIsError && registerError && (
              <p className="mt-2 text-sm text-red-600">
                {registerError.message || 'Registration failed. Please try again.'}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">Username Requirements:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center">
                <span className={username.length >= 3 ? 'text-green-600' : ''}>
                  {username.length >= 3 ? '✓' : '•'} 3-20 characters
                </span>
              </li>
              <li className="flex items-center">
                <span className={/^[a-zA-Z0-9_]*$/.test(username) ? 'text-green-600' : ''}>
                  {/^[a-zA-Z0-9_]*$/.test(username) ? '✓' : '•'} Letters, numbers, and underscores only
                </span>
              </li>
              <li className="flex items-center">
                <span>• Unique (not taken by another player)</span>
              </li>
            </ul>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={registerIsLoading || !username || !!error}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform ${
              registerIsLoading || !username || !!error
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg'
            }`}
          >
            {registerIsLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register Username (FREE)'
            )}
          </button>

          {/* Success message */}
          {registerIsSuccess && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-800 font-semibold">
                Registration successful!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to play...
              </p>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-sm text-gray-500">
            <p>Registration is <span className="font-semibold text-green-600">FREE</span></p>
            <p className="mt-1">You only need to register once</p>
          </div>
        </div>
      </div>
    </div>
  );
}
