import ErrorLogger, { errorLogger } from '@/utils/errorLogger';

describe('ErrorLogger', () => {
  let logger: ErrorLogger;

  beforeEach(() => {
    logger = new ErrorLogger({ enableLogging: true });
  });

  describe('logging', () => {
    it('should log error entries', () => {
      const error = new Error('Test error');
      logger.logError(error, {}, 'critical');

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test error');
      expect(logs[0].severity).toBe('critical');
    });

    it('should include context in logs', () => {
      const error = new Error('Test error');
      const context = { userId: '123', component: 'TestComponent' };
      logger.logError(error, context, 'warning');

      const logs = logger.getLogs();
      expect(logs[0].context).toEqual(context);
    });

    it('should include stack trace', () => {
      const error = new Error('Test error');
      logger.logError(error, {}, 'info');

      const logs = logger.getLogs();
      expect(logs[0].stack).toBeDefined();
      expect(logs[0].stack).toContain('Test error');
    });

    it('should add timestamp to logs', () => {
      const error = new Error('Test error');
      logger.logError(error, {});

      const logs = logger.getLogs();
      expect(logs[0].timestamp).toBeDefined();
    });
  });

  describe('log retrieval', () => {
    it('should retrieve all logs', () => {
      logger.logError(new Error('Error 1'), {}, 'critical');
      logger.logError(new Error('Error 2'), {}, 'warning');
      logger.logError(new Error('Error 3'), {}, 'info');

      const logs = logger.getLogs();
      expect(logs).toHaveLength(3);
    });

    it('should filter logs by severity', () => {
      logger.logError(new Error('Critical'), {}, 'critical');
      logger.logError(new Error('Warning'), {}, 'warning');
      logger.logError(new Error('Critical 2'), {}, 'critical');

      const criticalLogs = logger.getLogsBySeverity('critical');
      expect(criticalLogs).toHaveLength(2);

      const warningLogs = logger.getLogsBySeverity('warning');
      expect(warningLogs).toHaveLength(1);
    });
  });

  describe('log management', () => {
    it('should clear all logs', () => {
      logger.logError(new Error('Error 1'), {});
      logger.logError(new Error('Error 2'), {});

      expect(logger.getLogs()).toHaveLength(2);

      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });

    it('should maintain max log limit', () => {
      // Log more than 100 errors
      for (let i = 0; i < 105; i++) {
        logger.logError(new Error(`Error ${i}`), {});
      }

      const logs = logger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(100);
    });
  });

  describe('configuration', () => {
    it('should respect enableLogging config', () => {
      const disabledLogger = new ErrorLogger({ enableLogging: false });
      disabledLogger.logError(new Error('Test'), {});

      expect(disabledLogger.getLogs()).toHaveLength(0);
    });

    it('should use default config', () => {
      const defaultLogger = new ErrorLogger();
      defaultLogger.logError(new Error('Test'), {});

      expect(defaultLogger.getLogs()).toHaveLength(1);
    });
  });
});
