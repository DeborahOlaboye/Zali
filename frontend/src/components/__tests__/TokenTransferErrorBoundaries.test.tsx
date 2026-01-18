import { render, screen, fireEvent } from '@testing-library/react';
import { TokenTransferErrorBoundary } from '../TokenTransferErrorBoundary';
import { TransactionErrorBoundary } from '../TransactionErrorBoundary';
import { WalletErrorBoundary } from '../WalletErrorBoundary';

// Mock components that throw errors
const ThrowTokenError = ({ errorMessage = 'Insufficient funds' }) => {
  throw new Error(errorMessage);
};

const ThrowTransactionError = ({ errorMessage = 'Transaction failed' }) => {
  throw new Error(errorMessage);
};

const ThrowWalletError = ({ errorMessage = 'No ethereum provider found' }) => {
  throw new Error(errorMessage);
};

describe('Token Transfer Error Boundaries', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('TokenTransferErrorBoundary', () => {
    it('should render transfer failed UI when error occurs', () => {
      render(
        <TokenTransferErrorBoundary tokenSymbol="USDC">
          <ThrowTokenError />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText('Transfer Failed')).toBeInTheDocument();
      expect(screen.getByText(/Insufficient USDC balance/)).toBeInTheDocument();
    });

    it('should display transfer details when provided', () => {
      render(
        <TokenTransferErrorBoundary 
          tokenSymbol="ETH"
          amount="1.5"
          recipientAddress="0x1234567890123456789012345678901234567890"
        >
          <ThrowTokenError />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText('Amount:')).toBeInTheDocument();
      expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
      expect(screen.getByText('To:')).toBeInTheDocument();
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
    });

    it('should handle user rejection errors differently', () => {
      render(
        <TokenTransferErrorBoundary>
          <ThrowTokenError errorMessage="User rejected the request" />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText('Transaction was cancelled by user.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.queryByText('Retry Transfer')).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const onRetry = jest.fn();

      render(
        <TokenTransferErrorBoundary onRetry={onRetry}>
          <ThrowTokenError errorMessage="Network error" />
        </TokenTransferErrorBoundary>
      );

      const retryButton = screen.getByText('Retry Transfer');
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalled();
    });

    it('should handle gas limit errors', () => {
      render(
        <TokenTransferErrorBoundary>
          <ThrowTokenError errorMessage="Gas limit exceeded" />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText(/gas limit/)).toBeInTheDocument();
    });

    it('should handle allowance errors', () => {
      render(
        <TokenTransferErrorBoundary tokenSymbol="DAI">
          <ThrowTokenError errorMessage="Insufficient allowance" />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText(/approve DAI spending/)).toBeInTheDocument();
    });
  });

  describe('TransactionErrorBoundary', () => {
    it('should render transaction error UI', () => {
      render(
        <TransactionErrorBoundary transactionType="Swap">
          <ThrowTransactionError />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText('Transaction Failed')).toBeInTheDocument();
      expect(screen.getByText(/Swap could not be completed/)).toBeInTheDocument();
    });

    it('should categorize insufficient funds errors', () => {
      render(
        <TransactionErrorBoundary>
          <ThrowTransactionError errorMessage="Insufficient funds for gas" />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText('Insufficient Funds')).toBeInTheDocument();
      expect(screen.getByText(/don't have enough ETH/)).toBeInTheDocument();
      expect(screen.queryByText('Retry Transaction')).not.toBeInTheDocument();
    });

    it('should categorize gas errors', () => {
      render(
        <TransactionErrorBoundary>
          <ThrowTransactionError errorMessage="Gas estimation failed" />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText('Gas Error')).toBeInTheDocument();
      expect(screen.getByText('Retry Transaction')).toBeInTheDocument();
    });

    it('should categorize reverted transactions', () => {
      render(
        <TransactionErrorBoundary>
          <ThrowTransactionError errorMessage="Transaction reverted" />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText('Transaction Reverted')).toBeInTheDocument();
      expect(screen.getByText(/smart contract rejected/)).toBeInTheDocument();
      expect(screen.queryByText('Retry Transaction')).not.toBeInTheDocument();
    });

    it('should handle user rejection with warning styling', () => {
      render(
        <TransactionErrorBoundary>
          <ThrowTransactionError errorMessage="User denied transaction signature" />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText('Transaction Cancelled')).toBeInTheDocument();
      const container = screen.getByText('Transaction Cancelled').closest('div');
      expect(container).toHaveClass('bg-yellow-50');
    });

    it('should call onRetry when retry is clicked', () => {
      const onRetry = jest.fn();

      render(
        <TransactionErrorBoundary onRetry={onRetry}>
          <ThrowTransactionError errorMessage="Network timeout" />
        </TransactionErrorBoundary>
      );

      const retryButton = screen.getByText('Retry Transaction');
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('WalletErrorBoundary', () => {
    it('should render wallet not found error', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError />
        </WalletErrorBoundary>
      );

      expect(screen.getByText('Wallet Not Found')).toBeInTheDocument();
      expect(screen.getByText(/install MetaMask/)).toBeInTheDocument();
      expect(screen.getByText('Install Wallet')).toBeInTheDocument();
    });

    it('should provide external link for wallet installation', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError />
        </WalletErrorBoundary>
      );

      const installLink = screen.getByText('Install Wallet');
      expect(installLink.closest('a')).toHaveAttribute('href', 'https://metamask.io/download/');
      expect(installLink.closest('a')).toHaveAttribute('target', '_blank');
    });

    it('should handle connection rejection', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError errorMessage="User rejected the request" />
        </WalletErrorBoundary>
      );

      expect(screen.getByText('Connection Rejected')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should handle wrong network errors', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError errorMessage="Unsupported chain id" />
        </WalletErrorBoundary>
      );

      expect(screen.getByText('Wrong Network')).toBeInTheDocument();
      expect(screen.getByText(/switch to the correct network/)).toBeInTheDocument();
    });

    it('should handle pending connection', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError errorMessage="Connection already pending" />
        </WalletErrorBoundary>
      );

      expect(screen.getByText('Connection Pending')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
      expect(screen.queryByText('Check Wallet')).not.toBeInTheDocument();
    });

    it('should call onReconnect when reconnect is clicked', () => {
      const onReconnect = jest.fn();

      render(
        <WalletErrorBoundary onReconnect={onReconnect}>
          <ThrowWalletError errorMessage="User denied connection" />
        </WalletErrorBoundary>
      );

      const reconnectButton = screen.getByText('Try Again');
      fireEvent.click(reconnectButton);

      expect(onReconnect).toHaveBeenCalled();
    });

    it('should show helpful tips', () => {
      render(
        <WalletErrorBoundary>
          <ThrowWalletError />
        </WalletErrorBoundary>
      );

      expect(screen.getByText(/Make sure your wallet is unlocked/)).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should handle nested error boundaries correctly', () => {
      render(
        <WalletErrorBoundary>
          <TokenTransferErrorBoundary>
            <ThrowTokenError />
          </TokenTransferErrorBoundary>
        </WalletErrorBoundary>
      );

      // TokenTransferErrorBoundary should catch the error first
      expect(screen.getByText('Transfer Failed')).toBeInTheDocument();
      expect(screen.queryByText('Wallet Not Found')).not.toBeInTheDocument();
    });

    it('should propagate wallet errors to wallet boundary', () => {
      const WalletComponent = () => {
        throw new Error('No ethereum provider found');
      };

      render(
        <WalletErrorBoundary>
          <TokenTransferErrorBoundary>
            <WalletComponent />
          </TokenTransferErrorBoundary>
        </WalletErrorBoundary>
      );

      // Should be caught by the inner TokenTransferErrorBoundary first
      expect(screen.getByText('Transfer Failed')).toBeInTheDocument();
    });
  });

  describe('Error Message Customization', () => {
    it('should customize error messages based on token symbol', () => {
      render(
        <TokenTransferErrorBoundary tokenSymbol="WETH">
          <ThrowTokenError errorMessage="Insufficient balance" />
        </TokenTransferErrorBoundary>
      );

      expect(screen.getByText(/Insufficient WETH balance/)).toBeInTheDocument();
    });

    it('should customize transaction type in error messages', () => {
      render(
        <TransactionErrorBoundary transactionType="Staking">
          <ThrowTransactionError />
        </TransactionErrorBoundary>
      );

      expect(screen.getByText(/Staking could not be completed/)).toBeInTheDocument();
      expect(screen.getByText('Retry Staking')).toBeInTheDocument();
    });
  });
});