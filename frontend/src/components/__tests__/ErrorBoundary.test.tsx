import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '@/components/ErrorBoundary';

// Component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

// Component that doesn't throw
const SafeComponent = () => <div>Safe component</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );
      expect(screen.getByText('Safe component')).toBeInTheDocument();
    });

    it('should render default fallback when error occurs', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error) => (
        <div>Custom error: {error.message}</div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorComponent />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should display error message', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/We encountered an issue/)).toBeInTheDocument();
    });
  });

  describe('error recovery', () => {
    it('should reset error when try again button is clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

      // Rerender with safe component
      rerender(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /Try Again/i });
      await user.click(button);

      expect(screen.getByText('Safe component')).toBeInTheDocument();
    });
  });

  describe('component metadata', () => {
    it('should display component name when provided', () => {
      render(
        <ErrorBoundary name="TestComponent">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/TestComponent/)).toBeInTheDocument();
    });

    it('should show error level', () => {
      render(
        <ErrorBoundary level="section">
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});
