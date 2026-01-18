import { isRecoverableError } from './errorAnalyzer';

export interface RecoveryStrategy {
  name: string;
  canRecover: (error: Error) => boolean;
  recover: (error: Error) => Promise<boolean>;
  maxAttempts?: number;
  delay?: number;
}

export class ErrorRecoveryManager {
  private strategies: RecoveryStrategy[] = [];
  private recoveryAttempts = new Map<string, number>();

  addStrategy(strategy: RecoveryStrategy) {
    this.strategies.push(strategy);
  }

  async attemptRecovery(error: Error): Promise<boolean> {
    if (!isRecoverableError(error)) {
      return false;
    }

    const errorKey = `${error.name}:${error.message}`;
    const attempts = this.recoveryAttempts.get(errorKey) || 0;

    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        const maxAttempts = strategy.maxAttempts || 3;
        
        if (attempts >= maxAttempts) {
          continue;
        }

        try {
          this.recoveryAttempts.set(errorKey, attempts + 1);
          
          if (strategy.delay) {
            await new Promise(resolve => setTimeout(resolve, strategy.delay));
          }

          const recovered = await strategy.recover(error);
          
          if (recovered) {
            this.recoveryAttempts.delete(errorKey);
            return true;
          }
        } catch (recoveryError) {
          console.warn(`Recovery strategy "${strategy.name}" failed:`, recoveryError);
        }
      }
    }

    return false;
  }

  clearAttempts(errorKey?: string) {
    if (errorKey) {
      this.recoveryAttempts.delete(errorKey);
    } else {
      this.recoveryAttempts.clear();
    }
  }
}

// Default recovery strategies
export const defaultRecoveryStrategies: RecoveryStrategy[] = [
  {
    name: 'NetworkRetry',
    canRecover: (error) => 
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.name === 'NetworkError',
    recover: async () => {
      // Simple network connectivity check
      try {
        await fetch('/api/health', { method: 'HEAD' });
        return true;
      } catch {
        return false;
      }
    },
    maxAttempts: 3,
    delay: 1000,
  },
  {
    name: 'LocalStorageRecovery',
    canRecover: (error) => 
      error.message.includes('localStorage') ||
      error.message.includes('QuotaExceededError'),
    recover: async () => {
      try {
        // Clear some localStorage items to free up space
        const keys = Object.keys(localStorage);
        const oldKeys = keys.filter(key => {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              return parsed.timestamp && Date.now() - parsed.timestamp > 86400000; // 24 hours
            }
          } catch {
            return true; // Remove invalid items
          }
          return false;
        });
        
        oldKeys.forEach(key => localStorage.removeItem(key));
        return oldKeys.length > 0;
      } catch {
        return false;
      }
    },
    maxAttempts: 1,
  },
  {
    name: 'ComponentRefresh',
    canRecover: (error) => 
      error.message.includes('ChunkLoadError') ||
      error.message.includes('Loading chunk'),
    recover: async () => {
      // Force reload for chunk loading errors
      window.location.reload();
      return true;
    },
    maxAttempts: 1,
  },
];

// Global recovery manager instance
export const globalRecoveryManager = new ErrorRecoveryManager();

// Initialize with default strategies
defaultRecoveryStrategies.forEach(strategy => {
  globalRecoveryManager.addStrategy(strategy);
});

// Recovery hook
export function useErrorRecovery() {
  const attemptRecovery = async (error: Error): Promise<boolean> => {
    return globalRecoveryManager.attemptRecovery(error);
  };

  const addRecoveryStrategy = (strategy: RecoveryStrategy) => {
    globalRecoveryManager.addStrategy(strategy);
  };

  const clearRecoveryAttempts = (errorKey?: string) => {
    globalRecoveryManager.clearAttempts(errorKey);
  };

  return {
    attemptRecovery,
    addRecoveryStrategy,
    clearRecoveryAttempts,
  };
}