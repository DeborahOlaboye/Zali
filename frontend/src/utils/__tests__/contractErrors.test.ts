/**
 * Tests for contract error handling utilities
 * 
 * To run these tests, install the following dependencies:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @types/jest
 */

import {
  parseContractError,
  ContractErrorType,
  isTokenTransferError,
  isInsufficientAllowanceError,
  isTokenApprovalError,
  isUserRejectedError,
  isInsufficientFundsError,
} from '../contractErrors';

describe('contractErrors', () => {
  describe('isTokenTransferError', () => {
    it('should detect token transfer errors from message', () => {
      const error = { message: 'ERC20: transfer failed' };
      expect(isTokenTransferError(error)).toBe(true);
    });

    it('should detect token transfer errors from reason', () => {
      const error = { reason: 'Token transfer reverted' };
      expect(isTokenTransferError(error)).toBe(true);
    });

    it('should return false for non-transfer errors', () => {
      const error = { message: 'Some other error' };
      expect(isTokenTransferError(error)).toBe(false);
    });
  });

  describe('isInsufficientAllowanceError', () => {
    it('should detect insufficient allowance errors', () => {
      const error = { message: 'ERC20: insufficient allowance' };
      expect(isInsufficientAllowanceError(error)).toBe(true);
    });

    it('should detect allowance too low errors', () => {
      const error = { message: 'Allowance too low' };
      expect(isInsufficientAllowanceError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = { message: 'Some other error' };
      expect(isInsufficientAllowanceError(error)).toBe(false);
    });
  });

  describe('isTokenApprovalError', () => {
    it('should detect approval errors from message', () => {
      const error = { message: 'Token approval failed' };
      expect(isTokenApprovalError(error)).toBe(true);
    });

    it('should detect approval errors from reason', () => {
      const error = { reason: 'Approval reverted' };
      expect(isTokenApprovalError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = { message: 'Some other error' };
      expect(isTokenApprovalError(error)).toBe(false);
    });
  });

  describe('parseContractError', () => {
    describe('Token transfer errors', () => {
      it('should parse insufficient token balance error', () => {
        const error = { message: 'ERC20: transfer amount exceeds balance' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.INSUFFICIENT_TOKEN_BALANCE);
        expect(result.message).toContain('Insufficient token balance');
        expect(result.message).toContain('cUSD');
      });

      it('should parse insufficient allowance error', () => {
        const error = { message: 'ERC20: insufficient allowance' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.INSUFFICIENT_ALLOWANCE);
        expect(result.message).toContain('Token approval required');
      });

      it('should parse transfer to zero address error', () => {
        const error = { message: 'ERC20: transfer to zero address' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TRANSFER_TO_ZERO_ADDRESS);
        expect(result.message).toContain('invalid address');
      });

      it('should parse zero amount transfer error', () => {
        const error = { message: 'Transfer amount is zero' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.ZERO_AMOUNT_TRANSFER);
        expect(result.message).toContain('greater than zero');
      });

      it('should parse generic token transfer failure', () => {
        const error = { message: 'Token transfer reverted' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TOKEN_TRANSFER_FAILED);
        expect(result.message).toContain('Token transfer failed');
      });
    });

    describe('Token approval errors', () => {
      it('should parse approval rejection error', () => {
        const error = { 
          message: 'User rejected',
          code: 4001 
        };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TOKEN_APPROVAL_REJECTED);
        expect(result.message).toContain('cancelled');
      });

      it('should parse approval failure error', () => {
        const error = { message: 'Token approval failed' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TOKEN_APPROVAL_FAILED);
        expect(result.message).toContain('Token approval failed');
      });
    });

    describe('User rejection errors', () => {
      it('should parse user rejection with code 4001', () => {
        const error = { code: 4001 };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TRANSACTION_REJECTED);
        expect(result.message).toContain('rejected');
      });

      it('should parse user rejection with ACTION_REJECTED', () => {
        const error = { code: 'ACTION_REJECTED' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.TRANSACTION_REJECTED);
      });
    });

    describe('Insufficient funds errors', () => {
      it('should parse insufficient funds error', () => {
        const error = { message: 'insufficient funds for transaction' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.INSUFFICIENT_FUNDS);
        expect(result.message).toContain('Insufficient funds');
      });
    });

    describe('Network errors', () => {
      it('should parse network errors', () => {
        const error = { message: 'Network error occurred' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.NETWORK_ERROR);
        expect(result.message).toContain('Network error');
      });
    });

    describe('Contract-specific errors', () => {
      it('should parse not registered error', () => {
        const error = { message: 'Player is not registered' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.NOT_REGISTERED);
        expect(result.message).toContain('register');
      });

      it('should parse already registered error', () => {
        const error = { message: 'Address is already registered' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.ALREADY_REGISTERED);
        expect(result.message).toContain('already registered');
      });

      it('should parse invalid session error', () => {
        const error = { message: 'Session does not exist' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.INVALID_SESSION);
        expect(result.message).toContain('Invalid game session');
      });
    });

    describe('Unknown errors', () => {
      it('should handle unknown errors gracefully', () => {
        const error = { message: 'Some unknown error' };
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.UNKNOWN_ERROR);
        expect(result.message).toBe('Some unknown error');
      });

      it('should handle errors without message', () => {
        const error = {};
        const result = parseContractError(error);
        
        expect(result.code).toBe(ContractErrorType.UNKNOWN_ERROR);
        expect(result.message).toContain('unknown error');
      });
    });
  });

  describe('Error detection helpers', () => {
    it('isUserRejectedError should detect user rejections', () => {
      expect(isUserRejectedError({ code: 4001 })).toBe(true);
      expect(isUserRejectedError({ code: 'ACTION_REJECTED' })).toBe(true);
      expect(isUserRejectedError({ message: 'User rejected' })).toBe(true);
      expect(isUserRejectedError({ message: 'Some error' })).toBe(false);
    });

    it('isInsufficientFundsError should detect insufficient funds', () => {
      expect(isInsufficientFundsError({ message: 'insufficient funds' })).toBe(true);
      expect(isInsufficientFundsError({ message: 'not enough funds' })).toBe(true);
      expect(isInsufficientFundsError({ code: 'INSUFFICIENT_FUNDS' })).toBe(true);
      expect(isInsufficientFundsError({ message: 'Some error' })).toBe(false);
    });
  });
});

