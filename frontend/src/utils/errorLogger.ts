// Error logging and monitoring utility

import { ErrorLogEntry, ErrorBoundaryConfig } from '@/types/errorBoundary';

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];
  private config: ErrorBoundaryConfig;
  private maxLogs = 100;

  constructor(config: ErrorBoundaryConfig = {}) {
    this.config = {
      enableLogging: true,
      enableMonitoring: true,
      showDetailedErrors: process.env.NODE_ENV === 'development',
      ...config,
    };
  }

  /**
   * Log an error entry
   */
  log(entry: ErrorLogEntry): void {
    if (!this.config.enableLogging) return;

    const timestampedEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    };

    this.logs.push(timestampedEntry);

    // Keep logs at a reasonable size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console in development
    if (this.config.showDetailedErrors) {
      const color = this.getSeverityColor(entry.severity);
      console.group(`%c[${entry.severity.toUpperCase()}] ${entry.message}`, `color: ${color}`);
      console.log('Timestamp:', timestampedEntry.timestamp);
      if (entry.stack) console.log('Stack:', entry.stack);
      if (entry.context) console.log('Context:', entry.context);
      console.groupEnd();
    }

    // Send to server if configured
    if (this.config.logToServer && this.config.serverLogEndpoint) {
      this.sendToServer(timestampedEntry);
    }
  }

  /**
   * Log an error with context
   */
  logError(
    error: Error,
    context?: Record<string, any>,
    severity: 'critical' | 'warning' | 'info' = 'critical'
  ): void {
    this.log({
      message: error.message,
      stack: error.stack,
      context,
      severity,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: 'critical' | 'warning' | 'info'): ErrorLogEntry[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Send logs to server
   */
  private async sendToServer(entry: ErrorLogEntry): Promise<void> {
    try {
      if (!this.config.serverLogEndpoint) return;

      await fetch(this.config.serverLogEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send error log to server:', error);
    }
  }

  /**
   * Get severity color for console output
   */
  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical':
        return '#dc2626'; // red-600
      case 'warning':
        return '#ea580c'; // orange-600
      case 'info':
        return '#2563eb'; // blue-600
      default:
        return '#6b7280'; // gray-500
    }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Export class for testing
export default ErrorLogger;
