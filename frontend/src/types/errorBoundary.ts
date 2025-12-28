// Error boundary types and interfaces

export type ErrorSeverity = 'critical' | 'warning' | 'info';

export interface ErrorLogEntry {
  timestamp: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: ErrorSeverity;
}

export interface ErrorBoundaryConfig {
  enableLogging?: boolean;
  enableMonitoring?: boolean;
  showDetailedErrors?: boolean;
  logToServer?: boolean;
  serverLogEndpoint?: string;
}

export interface ErrorContextType {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  severity: ErrorSeverity;
}

export type ErrorHandler = (error: Error, errorInfo: React.ErrorInfo) => void;
export type ErrorLogger = (entry: ErrorLogEntry) => void;
