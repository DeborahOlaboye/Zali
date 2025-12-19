import { ApiException, ErrorCode, ERROR_MESSAGES } from '../errors';

describe('Error Types', () => {
  describe('ApiException', () => {
    it('should create an ApiException with required fields', () => {
      const exception = new ApiException(
        ErrorCode.INVALID_REQUEST,
        'Invalid request body',
        400
      );

      expect(exception.code).toBe(ErrorCode.INVALID_REQUEST);
      expect(exception.message).toBe('Invalid request body');
      expect(exception.statusCode).toBe(400);
      expect(exception instanceof Error).toBe(true);
    });

    it('should create an ApiException with details', () => {
      const details = { field: 'username', value: '' };
      const exception = new ApiException(
        ErrorCode.USERNAME_INVALID,
        'Username is required',
        400,
        details
      );

      expect(exception.details).toEqual(details);
    });

    it('should convert exception to JSON', () => {
      const exception = new ApiException(
        ErrorCode.INSUFFICIENT_BALANCE,
        'Insufficient balance',
        402
      );

      const json = exception.toJSON();

      expect(json.code).toBe(ErrorCode.INSUFFICIENT_BALANCE);
      expect(json.message).toBe('Insufficient balance');
      expect(json.statusCode).toBe(402);
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('ErrorCode enum', () => {
    it('should have all required error codes', () => {
      expect(ErrorCode.INVALID_REQUEST).toBe('INVALID_REQUEST');
      expect(ErrorCode.INVALID_INPUT).toBe('INVALID_INPUT');
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCode.INSUFFICIENT_BALANCE).toBe('INSUFFICIENT_BALANCE');
      expect(ErrorCode.GAME_NOT_FOUND).toBe('GAME_NOT_FOUND');
      expect(ErrorCode.WALLET_NOT_CONNECTED).toBe('WALLET_NOT_CONNECTED');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have messages for all critical error codes', () => {
      expect(ERROR_MESSAGES[ErrorCode.INVALID_REQUEST]).toBeDefined();
      expect(ERROR_MESSAGES[ErrorCode.INSUFFICIENT_BALANCE]).toBeDefined();
      expect(ERROR_MESSAGES[ErrorCode.TRANSACTION_FAILED]).toBeDefined();
      expect(ERROR_MESSAGES[ErrorCode.WALLET_NOT_CONNECTED]).toBeDefined();
    });

    it('should return appropriate error messages', () => {
      const msg = ERROR_MESSAGES[ErrorCode.INSUFFICIENT_BALANCE];
      expect(msg).toContain('Insufficient balance');
    });
  });

  describe('Validation Error Response', () => {
    it('should validate error response structure', () => {
      const errorResponse = {
        success: false,
        error: {
          code: ErrorCode.USERNAME_INVALID,
          message: 'Username validation failed',
        },
        validationErrors: [
          {
            field: 'username',
            message: 'Username must be 3-20 characters',
            code: 'LENGTH_ERROR',
          },
        ],
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.validationErrors).toHaveLength(1);
      expect(errorResponse.validationErrors[0].field).toBe('username');
    });
  });
});
