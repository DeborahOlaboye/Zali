import { motion } from 'framer-motion';
import { 
  XCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ReactNode, useEffect } from 'react';
import { WalletErrorType } from '@/utils/walletErrors';

/**
 * ErrorDisplay shows user-friendly error, warning, info, or success messages
 * 
 * Displays messages with appropriate icons and styling. Supports
 * auto-dismiss, retry actions, and custom content.
 * 
 * @component
 * @example
 * <ErrorDisplay 
 *   variant="error"
 *   title="Transaction Failed"
 *   message="Please try again"
 * />
 */
type ErrorVariant = 'error' | 'warning' | 'info' | 'success';

type ErrorDisplayProps = {
  error: string | ReactNode | null;
  title?: string;
  variant?: ErrorVariant;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
  showIcon?: boolean;
  autoDismiss?: boolean;
  dismissAfter?: number;
};

const variantStyles = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-700',
    icon: XCircleIcon,
    iconColor: 'text-red-400',
    title: 'Error'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400',
    title: 'Warning'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-700',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400',
    title: 'Info'
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-700',
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
    title: 'Success'
  }
};

export function ErrorDisplay({
  error,
  title,
  variant = 'error',
  onDismiss,
  onRetry,
  className = '',
  showIcon = true,
  autoDismiss = false,
  dismissAfter = 5000
}: ErrorDisplayProps) {
  if (!error) return null;

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  // Auto-dismiss after specified time
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss, dismissAfter]);

  const renderErrorContent = () => {
    if (typeof error === 'string') {
      return error.split('\n').map((line, i) => (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {line}
        </p>
      ));
    }
    return error;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`rounded-md ${styles.bg} ${styles.border} border-l-4 p-4 mb-4 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${styles.iconColor}`} aria-hidden="true" />
          </div>
        )}
        <div className={showIcon ? 'ml-3' : ''}>
          {title && (
            <h3 className={`text-sm font-semibold ${styles.text} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles.text}`}>
            {renderErrorContent()}
          </div>
          
          {(onRetry || onDismiss) && (
            <div className="mt-2 flex space-x-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`inline-flex items-center rounded-md ${styles.text} bg-transparent font-medium hover:opacity-80 focus:outline-none`}
                >
                  <ArrowPathIcon className="mr-1.5 h-4 w-4" />
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`inline-flex items-center rounded-md ${styles.text} bg-transparent font-medium hover:opacity-80 focus:outline-none`}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        
        {onDismiss && !onRetry && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md ${styles.bg} p-1.5 ${styles.iconColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper component for common error types
type CommonErrorProps = Omit<ErrorDisplayProps, 'variant'>;

export function ErrorAlert(props: CommonErrorProps) {
  return <ErrorDisplay variant="error" {...props} />;
}

export function WarningAlert(props: CommonErrorProps) {
  return <ErrorDisplay variant="warning" {...props} />;
}

export function InfoAlert(props: CommonErrorProps) {
  return <ErrorDisplay variant="info" {...props} />;
}

export function SuccessAlert(props: CommonErrorProps) {
  return <ErrorDisplay variant="success" {...props} />;
}
