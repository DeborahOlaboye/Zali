import {
  analyzeError,
  getErrorCategory,
  isRecoverableError,
  getErrorMessage,
} from '@/utils/errorAnalyzer';

describe('errorAnalyzer', () => {
  describe('analyzeError', () => {
    it('should analyze network errors', () => {
      const error = new Error('Network timeout');
      const analysis = analyzeError(error);

      expect(analysis.isNetworkError).toBe(true);
      expect(analysis.category).toBe('timeout');
      expect(analysis.severity).toBe('warning');
    });

    it('should analyze contract errors', () => {
      const error = new Error('Contract call revert');
      const analysis = analyzeError(error);

      expect(analysis.isContractError).toBe(true);
      expect(analysis.category).toBe('contract');
      expect(analysis.severity).toBe('critical');
    });

    it('should analyze user errors', () => {
      const error = new Error('User rejected the transaction');
      const analysis = analyzeError(error);

      expect(analysis.isUserError).toBe(true);
      expect(analysis.severity).toBe('info');
    });

    it('should provide suggested action for network errors', () => {
      const error = new Error('Fetch failed');
      const analysis = analyzeError(error);

      expect(analysis.suggestedAction).toContain('internet connection');
    });

    it('should handle null error', () => {
      const analysis = analyzeError(null);

      expect(analysis.severity).toBe('info');
      expect(analysis.category).toBe('unknown');
    });
  });

  describe('getErrorCategory', () => {
    it('should categorize wallet errors', () => {
      const error = new Error('Wallet connection failed');
      expect(getErrorCategory(error)).toBe('wallet');
    });

    it('should categorize network errors', () => {
      const error = new Error('Network request failed');
      expect(getErrorCategory(error)).toBe('network');
    });

    it('should categorize contract errors', () => {
      const error = new Error('Call revert');
      expect(getErrorCategory(error)).toBe('contract');
    });

    it('should categorize permission errors', () => {
      const error = new Error('Permission denied');
      expect(getErrorCategory(error)).toBe('permission');
    });

    it('should categorize balance errors', () => {
      const error = new Error('Insufficient balance');
      expect(getErrorCategory(error)).toBe('balance');
    });

    it('should categorize type errors', () => {
      const error = new TypeError('Cannot read property');
      expect(getErrorCategory(error)).toBe('type');
    });

    it('should categorize reference errors', () => {
      const error = new ReferenceError('Variable not defined');
      expect(getErrorCategory(error)).toBe('reference');
    });

    it('should return unknown for unrecognized errors', () => {
      const error = new Error('Some random error');
      expect(getErrorCategory(error)).toBe('unknown');
    });
  });

  describe('isRecoverableError', () => {
    it('should mark network errors as recoverable', () => {
      const error = new Error('Network timeout');
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should mark wallet errors as recoverable', () => {
      const error = new Error('Wallet disconnected');
      expect(isRecoverableError(error)).toBe(true);
    });

    it('should mark syntax errors as non-recoverable', () => {
      const error = new SyntaxError('Invalid syntax');
      expect(isRecoverableError(error)).toBe(false);
    });

    it('should mark reference errors as non-recoverable', () => {
      const error = new ReferenceError('Variable not defined');
      expect(isRecoverableError(error)).toBe(false);
    });

    it('should mark type errors as non-recoverable', () => {
      const error = new TypeError('Cannot read property');
      expect(isRecoverableError(error)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly message for wallet errors', () => {
      const error = new Error('Wallet connection failed');
      const message = getErrorMessage(error);

      expect(message).toContain('wallet');
    });

    it('should return user-friendly message for network errors', () => {
      const error = new Error('Network timeout');
      const message = getErrorMessage(error);

      expect(message).toContain('Network');
    });

    it('should return user-friendly message for contract errors', () => {
      const error = new Error('Contract call revert');
      const message = getErrorMessage(error);

      expect(message).toContain('Transaction');
    });

    it('should return user-friendly message for permission errors', () => {
      const error = new Error('Permission denied');
      const message = getErrorMessage(error);

      expect(message).toContain('Permission');
    });

    it('should return user-friendly message for balance errors', () => {
      const error = new Error('Insufficient balance');
      const message = getErrorMessage(error);

      expect(message).toContain('balance');
    });

    it('should return default message for null error', () => {
      const message = getErrorMessage(null);

      expect(message).toContain('unexpected error');
    });

    it('should return original error message for unknown errors', () => {
      const error = new Error('Custom error message');
      const message = getErrorMessage(error);

      expect(message).toContain('Custom error message');
    });
  });
});
