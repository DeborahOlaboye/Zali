'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { ContractError, ContractErrorType, parseContractError } from '@/utils/contractErrors';
import { useAccount, useSwitchChain } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { errorLogger } from '@/utils/errorLogger';

// Fallback UI components in case shadcn/ui is not available
const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default' 
}: { 
  children: ReactNode; 
  onClick: () => void; 
  className?: string; 
  variant?: 'default' | 'outline' | 'destructive' 
}) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      variant === 'outline' 
        ? 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700' 
        : variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    } ${className}`}
  >
    {children}
  </button>
);

const Alert = ({ 
  variant = 'default',
  children,
  className = ''
}: { 
  variant?: 'default' | 'destructive';
  children: ReactNode;
  className?: string;
}) => (
  <div className={`p-4 rounded-md border ${
    variant === 'destructive' 
      ? 'bg-red-50 border-red-200 text-red-700' 
      : 'bg-blue-50 border-blue-200 text-blue-700'
  } ${className}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-sm font-medium">{children}</h3>
);

const AlertDescription = ({ children }: { children: ReactNode }) => (
  <div className="mt-2 text-sm">{children}</div>
);

// Simple icon components to avoid external dependency
const AlertCircle = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshCw = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const AlertTriangle = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ShieldAlert = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface ContractErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ContractError, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: Record<string, any>;
}

interface ContractErrorBoundaryState {
  error: ContractError | null;
  errorInfo: ErrorInfo | null;
}

export class ContractErrorBoundary extends Component<ContractErrorBoundaryProps, ContractErrorBoundaryState> {
  constructor(props: ContractErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ContractErrorBoundaryState> {
    // If it's already a ContractError, use it as is
    if ('code' in error) {
      return { error: error as ContractError };
    }
    
    // Otherwise, parse the error to create a ContractError
    const { message, code, details } = parseContractError(error, {});
    const contractError = new Error(message) as ContractError;
    contractError.code = code;
    contractError.details = details;
    contractError.name = 'ContractError';
    
    return { error: contractError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const contractError = error as ContractError;
    
    // Log the error
    errorLogger.logError(error, {
      component: 'ContractErrorBoundary',
      errorCode: contractError.code,
      details: contractError.details,
      componentStack: errorInfo.componentStack,
    }, 'critical');
    
    console.error('ContractErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with the error info
    this.setState({ error: contractError, errorInfo });
    
    // Call the onError handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  renderErrorContent(error: ContractError) {
    // Use the provided fallback if available
    if (this.props.fallback) {
      return this.props.fallback(error, this.handleReset);
    }

    // Default error rendering based on error type
    switch (error.code) {
      case ContractErrorType.WALLET_NOT_CONNECTED:
        return (
          <DefaultErrorUI 
            title="Wallet Not Connected"
            message="Please connect your wallet to continue."
            onRetry={this.handleReset}
            icon={<AlertCircle className="h-5 w-5" />}
          />
        );
      
      case ContractErrorType.CHAIN_NOT_SUPPORTED:
      case ContractErrorType.NETWORK_SWITCH_REQUIRED:
        return (
          <SwitchNetworkErrorUI 
            requiredChainId={error.details?.requiredChainId}
            onRetry={this.handleReset}
          />
        );
      
      case ContractErrorType.INSUFFICIENT_FUNDS:
      case ContractErrorType.INSUFFICIENT_BALANCE:
        return (
          <DefaultErrorUI
            title="Insufficient Balance"
            message="You don't have enough funds to complete this transaction."
            onRetry={this.handleReset}
            action={
              <a 
                href="/faucet" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Test Tokens
              </a>
            }
            icon={<AlertCircle className="h-5 w-5" />}
          />
        );
      
      case ContractErrorType.TRANSACTION_REJECTED:
        return (
          <DefaultErrorUI
            title="Transaction Rejected"
            message="You rejected the transaction in your wallet."
            onRetry={this.handleReset}
            icon={<ShieldAlert className="h-5 w-5" />}
          />
        );
      
      case ContractErrorType.TRANSACTION_FAILED:
        return (
          <DefaultErrorUI
            title="Transaction Failed"
            message={error.message || "The transaction failed. Please try again."}
            onRetry={this.handleReset}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        );
      
      default:
        return (
          <DefaultErrorUI
            title="Something went wrong"
            message={error.message || "An unexpected error occurred."}
            onRetry={this.handleReset}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        );
    }
  }

  render() {
    if (this.state.error) {
      return this.renderErrorContent(this.state.error);
    }
    return this.props.children;
  }
}

// Helper components
interface DefaultErrorUIProps {
  title: string;
  message: string | ReactNode;
  onRetry?: () => void;
  action?: ReactNode;
  icon?: ReactNode;
}

function DefaultErrorUI({ title, message, onRetry, action, icon }: DefaultErrorUIProps) {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Alert variant="destructive">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icon || <AlertCircle className="h-5 w-5 text-destructive" />}
          </div>
          <div className="ml-3">
            <AlertTitle className="text-lg font-medium">{title}</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="text-sm">{message}</div>
              <div className="mt-4 flex space-x-3">
                {onRetry && (
                  <Button 
                    onClick={onRetry}
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
                {action}
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}

interface SwitchNetworkErrorUIProps {
  requiredChainId?: number;
  onRetry?: () => void;
}

function SwitchNetworkErrorUI({ requiredChainId, onRetry }: SwitchNetworkErrorUIProps) {
  const { switchChain } = useSwitchChain();
  const { chainId: currentChainId } = useAccount();
  
  const handleSwitchNetwork = async () => {
    if (requiredChainId) {
      try {
        await switchChain({ chainId: requiredChainId });
        onRetry?.();
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };
  
  const targetChain = requiredChainId ? 
    `Network ID: ${requiredChainId}` : 
    'the required network';
  
  return (
    <DefaultErrorUI
      title="Wrong Network"
      message={
        <span>
          Please switch to{' '}
          <span className="font-medium">{targetChain}</span> to continue.
          {currentChainId && ` (Current: ${currentChainId})`}
        </span>
      }
      onRetry={handleSwitchNetwork}
      action={
        <Button 
          onClick={handleSwitchNetwork}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Switch Network
        </Button>
      }
      icon={<AlertCircle className="h-5 w-5" />}
    />
  );
}

export default ContractErrorBoundary;
