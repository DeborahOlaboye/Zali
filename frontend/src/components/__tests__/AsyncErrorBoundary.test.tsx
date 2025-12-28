import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AsyncErrorBoundary from '@/components/AsyncErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Async operation failed');
};

const SafeComponent = () => <div>Async operation successful</div>;

describe('AsyncErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render children when there is no error', () => {
      render(
        <AsyncErrorBoundary>
          <SafeComponent />
        </AsyncErrorBoundary>
      );
      expect(screen.getByText('Async operation successful')).toBeInTheDocument();
    });

    it('should render default fallback when error occurs', () => {
      render(
        <AsyncErrorBoundary>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );
      expect(screen.getByText(/Async Operation Failed/)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error) => (
        <div>Custom async error: {error.message}</div>
      );

      render(
        <AsyncErrorBoundary fallback={customFallback}>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );
      expect(screen.getByText(/Custom async error/)).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <AsyncErrorBoundary onError={onError}>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should display error message', () => {
      render(
        <AsyncErrorBoundary>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      expect(screen.getByText(/Async operation failed/i)).toBeInTheDocument();
    });
  });

  describe('component metadata', () => {
    it('should display component name when provided', () => {
      const { container } = render(
        <AsyncErrorBoundary name="AsyncFetch">
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      expect(container.textContent).toContain('AsyncFetch');
    });
  });

  describe('error recovery', () => {
    it('should provide try again button', () => {
      render(
        <AsyncErrorBoundary>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /Try Again/i });
      expect(button).toBeInTheDocument();
    });
  });
});
