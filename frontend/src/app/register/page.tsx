'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { usePlayerRegistration } from '@/hooks/useContract';

export default function RegisterPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { isRegistered } = usePlayerRegistration();

  // For SimpleTriviaGame, no registration is needed - auto redirect
  useEffect(() => {
    if (isRegistered && isConnected) {
      const timer = setTimeout(() => {
        router.push('/play');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isRegistered, isConnected, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Connect Your Wallet
          </h1>
          <p className="text-center text-gray-600">
            Please connect your wallet to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Ready to Play!</h1>
          <p className="text-gray-600 mb-4">
            No registration required for the current game version.
          </p>
          <p className="text-sm text-gray-500">
            🚧 Username registration coming with TriviaGameV2 upgrade
          </p>
        </div>

        <div className="animate-pulse bg-blue-100 h-12 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-medium">Redirecting to game...</span>
        </div>
      </div>
    </div>
  );
}
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
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full" noValidate>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Register Your Username
          </h1>
          <p className="text-gray-600">
            Choose a unique username to start playing
          </p>
        </div>

        <div className="space-y-6">
          {/* Username Input */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Create Your Username
            </legend>
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Username (3-20 characters)
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username (3-20 characters)"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 pr-10'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                disabled={registerIsLoading}
                {...register('username', {
                  onChange: () => clearErrors('username'),
                })}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : 'username-help'}
              />
              
              {/* Character count */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {watchedUsername?.length || 0}/20
              </div>
            </div>
            
            {/* Help text and error message */}
            {!errors.username && (
              <p id="username-help" className="mt-2 text-sm text-gray-600">
                3-20 characters, letters, numbers, and underscores only
              </p>
            )}
            {errors.username && (
              <p id="username-error" className="mt-2 text-sm text-red-600 flex items-start">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.username.message}</span>
              </p>
            )}
            
            {/* Contract error */}
            {registerIsError && registerError && (
              <p className="mt-2 text-sm text-red-600 flex items-start" role="alert">
                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{registerError.message || 'Registration failed. Please try again.'}</span>
              </p>
            )}
          </fieldset>

          {/* Requirements */}
          <fieldset className="bg-blue-50 p-4 rounded-lg">
            <legend className="font-semibold text-sm text-blue-900 mb-3">Username Requirements</legend>
            <ul className="text-sm text-blue-800 space-y-2" aria-label="Username validation requirements">
              <li className="flex items-start">
                <span aria-hidden="true" className={`mr-2 flex-shrink-0 font-bold ${watchedUsername?.length >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                  {watchedUsername?.length >= 3 ? '✓' : '◯'}
                </span>
                <span className={watchedUsername?.length >= 3 ? 'text-green-700 font-medium' : 'text-blue-800'}>
                  3-20 characters
                </span>
              </li>
              <li className="flex items-start">
                <span aria-hidden="true" className={`mr-2 flex-shrink-0 font-bold ${watchedUsername && /^[a-zA-Z0-9_]+$/.test(watchedUsername) ? 'text-green-600' : 'text-gray-400'}`}>
                  {watchedUsername && /^[a-zA-Z0-9_]+$/.test(watchedUsername) ? '✓' : '◯'}
                </span>
                <span className={watchedUsername && /^[a-zA-Z0-9_]+$/.test(watchedUsername) ? 'text-green-700 font-medium' : 'text-blue-800'}>
                  Letters, numbers, and underscores only
                </span>
              </li>
              <li className="flex items-start">
                <span aria-hidden="true" className="mr-2 flex-shrink-0 text-gray-400">◯</span>
                <span className="text-blue-800">Unique (not taken by another player)</span>
              </li>
            </ul>
          </fieldset>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!isDirty || !isValid || registerIsLoading || registerIsSuccess}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !isDirty || !isValid || registerIsLoading || registerIsSuccess
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-400'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg focus:ring-purple-800'
            }`}
            aria-busy={registerIsLoading}
            aria-disabled={!isDirty || !isValid || registerIsLoading || registerIsSuccess}
          >
            {registerIsLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registering...</span>
              </span>
            ) : registerIsSuccess ? (
              <span>Registration Successful!</span>
            ) : (
              <span>Register Username (FREE)</span>
            )}
          </button>

          {/* Success message */}
          {registerIsSuccess && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center" role="status" aria-live="polite">
              <div className="text-4xl mb-2" aria-hidden="true">🎉</div>
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
            <p>
              Registration is{' '}
              <span className="font-semibold text-green-600">FREE</span>
            </p>
            <p className="mt-1">You only need to register once</p>
          </div>
        </div>
      </form>
    </div>
  );
}
