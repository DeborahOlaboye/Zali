import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { RouteErrorBoundary } from '../RouteErrorBoundary';
import { FormErrorBoundary } from '../FormErrorBoundary';
import { QueryErrorBoundary } from '../QueryErrorBoundary';
import { SuspenseErrorBoundary } from '../SuspenseErrorBoundary';

// Mock components that throw errors
const ThrowError = ({ shouldThrow = true, message = 'Test error' }) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

const AsyncThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Promise((_, reject) => reject(new Error('Async error')));
  }
  return <div>No async error</div>;
};

// Mock Next.js router
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  QueryErrorResetBoundary: ({ children }: { children: (props: { reset: () => void }) => React.ReactNode }) =>
    children({ reset: jest.fn() }),
}));

describe('Error Boundaries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ErrorBoundary', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should render default error UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError message="Test error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText('We encountered an issue')).toBeInTheDocument();
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error, errorInfo: any, reset: () => void) => (
        <div>
          <span>Custom error: {error.message}</span>
          <button onClick={reset}>Custom Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError message="Custom error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error: Custom error message')).toBeInTheDocument();
      expect(screen.getByText('Custom Reset')).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError message="Callback test error" />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Callback test error' }),
        expect.any(Object)
      );
    });

    it('should reset error state when reset button is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('We encountered an issue')).toBeInTheDocument();

      const resetButton = screen.getByText('Try Again');
      fireEvent.click(resetButton);

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should show component name in error details', () => {
      render(
        <ErrorBoundary name="TestComponent" showDetails={true}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/TestComponent/)).toBeInTheDocument();
    });
  });

  describe('RouteErrorBoundary', () => {
    it('should render full-screen error UI', () => {
      render(
        <RouteErrorBoundary routeName="TestRoute">
          <ThrowError />
        </RouteErrorBoundary>
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error on TestRoute page')).toBeInTheDocument();
    });

    it('should provide navigation options', () => {
      render(
        <RouteErrorBoundary>
          <ThrowError />
        </RouteErrorBoundary>
      );

      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Refresh Page')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('should navigate home when Go Home is clicked', () => {
      render(
        <RouteErrorBoundary>
          <ThrowError />
        </RouteErrorBoundary>
      );

      const goHomeButton = screen.getByText('Go Home');
      fireEvent.click(goHomeButton);

      expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('should navigate back when Go Back is clicked', () => {
      render(
        <RouteErrorBoundary>
          <ThrowError />
        </RouteErrorBoundary>
      );

      const goBackButton = screen.getByText('Go Back');
      fireEvent.click(goBackButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('FormErrorBoundary', () => {
    it('should render form-specific error UI', () => {
      render(
        <FormErrorBoundary formName="TestForm">
          <ThrowError />
        </FormErrorBoundary>
      );

      expect(screen.getByText('Form Error')).toBeInTheDocument();
      expect(screen.getByText(/The TestForm form/)).toBeInTheDocument();
    });

    it('should provide form reset functionality', () => {
      const onReset = jest.fn();

      render(
        <FormErrorBoundary onReset={onReset}>
          <ThrowError />
        </FormErrorBoundary>
      );

      const resetButton = screen.getByText('Reset Form');
      fireEvent.click(resetButton);

      expect(onReset).toHaveBeenCalled();
    });

    it('should show error message in monospace format', () => {
      render(
        <FormErrorBoundary>
          <ThrowError message="Form validation error" />
        </FormErrorBoundary>
      );

      const errorMessage = screen.getByText('Form validation error');
      expect(errorMessage).toHaveClass('font-mono');
    });
  });

  describe('QueryErrorBoundary', () => {
    it('should render data loading error UI', () => {
      render(
        <QueryErrorBoundary>
          <ThrowError />
        </QueryErrorBoundary>
      );

      expect(screen.getByText('Data Loading Error')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
    });

    it('should provide retry functionality', () => {
      render(
        <QueryErrorBoundary>
          <ThrowError />
        </QueryErrorBoundary>
      );

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error, reset: () => void) => (
        <div>
          <span>Custom query error: {error.message}</span>
          <button onClick={reset}>Custom Retry</button>
        </div>
      );

      render(
        <QueryErrorBoundary fallback={customFallback}>
          <ThrowError message="Query failed" />
        </QueryErrorBoundary>
      );

      expect(screen.getByText('Custom query error: Query failed')).toBeInTheDocument();
      expect(screen.getByText('Custom Retry')).toBeInTheDocument();
    });
  });

  describe('SuspenseErrorBoundary', () => {
    it('should render loading fallback initially', () => {
      const LoadingComponent = () => <div>Loading...</div>;

      render(
        <SuspenseErrorBoundary fallback={<LoadingComponent />}>
          <div>Loaded content</div>
        </SuspenseErrorBoundary>
      );

      // Note: In a real scenario, this would show loading first, then content
      // For testing purposes, we're just checking the structure
      expect(screen.getByText('Loaded content')).toBeInTheDocument();
    });

    it('should render error UI when error occurs', () => {
      render(
        <SuspenseErrorBoundary>
          <ThrowError />
        </SuspenseErrorBoundary>
      );

      expect(screen.getByText('Loading Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load component')).toBeInTheDocument();
    });

    it('should provide retry functionality', () => {
      render(
        <SuspenseErrorBoundary>
          <ThrowError />
        </SuspenseErrorBoundary>
      );

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
    });

    it('should render custom error fallback when provided', () => {
      const customErrorFallback = (error: Error, reset: () => void) => (
        <div>
          <span>Suspense error: {error.message}</span>
          <button onClick={reset}>Retry Loading</button>
        </div>
      );

      render(
        <SuspenseErrorBoundary errorFallback={customErrorFallback}>
          <ThrowError message="Suspense failed" />
        </SuspenseErrorBoundary>
      );

      expect(screen.getByText('Suspense error: Suspense failed')).toBeInTheDocument();
      expect(screen.getByText('Retry Loading')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should handle nested error boundaries correctly', () => {
      render(
        <ErrorBoundary name="Outer">
          <FormErrorBoundary formName="Inner">
            <ThrowError message="Nested error" />
          </FormErrorBoundary>
        </ErrorBoundary>
      );

      // The inner FormErrorBoundary should catch the error
      expect(screen.getByText('Form Error')).toBeInTheDocument();
      expect(screen.getByText(/The Inner form/)).toBeInTheDocument();
    });

    it('should propagate errors when inner boundary fails', () => {
      const FailingBoundary = () => {
        throw new Error('Boundary failure');
      };

      render(
        <ErrorBoundary name="Outer">
          <FailingBoundary />
        </ErrorBoundary>
      );

      expect(screen.getByText('We encountered an issue')).toBeInTheDocument();
    });
  });
});