'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, Connector } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getWalletError, 
  getWalletErrorMessage, 
  isUserRejectedError, 
  isRecoverableError,
  WalletErrorType
} from '@/utils/walletErrors';
import { trackWalletError } from '@/utils/errorTracking';
import { ErrorDisplay } from '@/components/ErrorDisplay';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

// Maximum number of retry attempts for recoverable errors
const MAX_RETRY_ATTEMPTS = 3;

interface ConnectorInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function SignInPage() {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [activeConnector, setActiveConnector] = useState<Connector | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  
  const { connect, connectors, error: wagmiError } = useConnect();
  const { isConnected, address } = useAccount();
  const { signIn, isLoading, clearError } = useAuth();
  const router = useRouter();
  
  // Define available wallet connectors with their metadata
  const availableConnectors: ConnectorInfo[] = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension'
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Scan with WalletConnect to connect'
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      icon: '🪙',
      description: 'Connect with Coinbase Wallet'
    }
  ];

  // Reset connection state when component mounts or address changes
  useEffect(() => {
    setConnectionState('idle');
    setConnectionError(null);
    setRetryCount(0);
    clearError();
  }, [address, clearError]);

  // Handle wagmi connection errors
  useEffect(() => {
    if (wagmiError) {
      const error = getWalletError(wagmiError);
      trackWalletError(wagmiError, { 
        context: 'wagmi_connect',
        errorType: error.type,
        retryCount,
        activeConnector
      });
      
      setConnectionError(error.message);
      setConnectionState('error');
    }
  }, [wagmiError, retryCount]);

  // Handle connection state changes
  useEffect(() => {
    if (isConnected && connectionState === 'connecting') {
      setConnectionState('connected');
      // Redirect after successful connection
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  }, [isConnected, connectionState, router]);

  const handleConnectError = useCallback((error: unknown) => {
    const walletError = getWalletError(error);
    
    if (isUserRejectedError(error)) {
      setConnectionError('Connection was rejected. Please try again.');
      setConnectionState('error');
      return;
    }
    
    if (isRecoverableError(error) && retryCount < MAX_RETRY_ATTEMPTS) {
      const nextRetry = retryCount + 1;
      setRetryCount(nextRetry);
      setConnectionError(`Connection issue. ${getWalletErrorMessage(walletError)} Retrying (${nextRetry}/${MAX_RETRY_ATTEMPTS})...`);
      
      // Auto-retry after a delay
      setTimeout(() => {
        if (activeConnector) {
          connect({ connector: activeConnector });
        }
      }, 1500);
    } else {
      setConnectionError(getWalletErrorMessage(walletError));
      setConnectionState('error');
    }
  }, [retryCount, activeConnector, connect]);

  const handleConnect = useCallback(async (connector: Connector) => {
    if (!connector) return;

    setConnectionState('connecting');
    setActiveConnector(connector);
    setConnectionError(null);
    clearError();

    try {
      await connect({ connector });
    } catch (error) {
      handleConnectError(error);
    }
  }, [connect, clearError, handleConnectError]);

  const getConnectorButtonText = (connectorName: string): string => {
    if (connectionState === 'connecting' && activeConnector?.name === connectorName) {
      return 'Connecting...';
    }
    if (connectionState === 'connected' && activeConnector?.name === connectorName) {
      return 'Connected!';
    }
    return `Connect with ${connectorName}`;
  };

  const getStatusMessage = (): string => {
    if (connectionState === 'connecting') {
      return 'Connecting to your wallet...';
    }
    if (connectionState === 'connected') {
      return 'Success! Redirecting...';
    }
    if (retryCount > 0) {
      return `Attempting to reconnect (${retryCount}/${MAX_RETRY_ATTEMPTS})...`;
    }
    return 'Connect your wallet to continue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Zali
          </h1>
          <p className="mt-2 text-sm text-gray-600" role="status" aria-live="polite">
            {getStatusMessage()}
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            <AnimatePresence>
              {connectionError && (
                <ErrorDisplay 
                  error={connectionError} 
                  onDismiss={() => setConnectionError(null)}
                />
              )}
            </AnimatePresence>

            <fieldset>
              <legend className="text-sm font-medium text-gray-900 mb-4">Connect your wallet</legend>
              <div className="space-y-4">
                {connectors
                  .filter((connector) => connector.ready)
                  .map((connector) => {
                    const connectorInfo = availableConnectors.find(c => c.id === connector.id) || {
                      id: connector.id,
                      name: connector.name,
                      icon: '🔗',
                      description: `Connect with ${connector.name}`
                    };
                    
                    const isActive = activeConnector?.id === connector.id && 
                                  (connectionState === 'connecting' || connectionState === 'connected');
                    
                    return (
                      <motion.button
                        key={connector.id}
                        onClick={() => handleConnect(connector)}
                        disabled={isLoading || isActive}
                        className={`w-full flex items-center justify-between px-6 py-4 border-2 rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-inner focus:ring-blue-600'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-gray-50 hover:shadow-md focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed'
                        }`}
                        whileHover={isActive ? {} : { scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        whileTap={isActive ? {} : { scale: 0.98 }}
                        aria-busy={isActive}
                        aria-label={isActive ? `${connectorInfo.name} - connecting` : `Connect with ${connectorInfo.name}`}
                      >
                        <span className="text-xl mr-3" aria-hidden="true">{connectorInfo.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{connectorInfo.name}</div>
                          <div className="text-xs text-gray-500">{connectorInfo.description}</div>
                        </div>
                        {isActive && (
                          <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                        )}
                      </motion.button>
                    );
                  })}
              </div>
            </fieldset>
              
              {/* Help section */}
              <div className="pt-4 mt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500">
                  Need help connecting?{' '}
                  <button 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                    onClick={() => {
                      setConnectionError('For help, please ensure you have a Web3 wallet installed and try again.');
                    }}
                    aria-label="Get help connecting wallet"
                  >
                    Get help
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
