import type { Meta, StoryObj } from '@storybook/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws an error for testing
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for the ErrorBoundary');
  }
  return <div>Component rendered successfully</div>;
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An error boundary component that catches JavaScript errors in the component tree and displays a fallback UI.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const NormalRender: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorThrowingComponent shouldThrow={false} />
    </ErrorBoundary>
  ),
};

export const WithError: Story = {
  render: () => (
    <ErrorBoundary>
      <ErrorThrowingComponent shouldThrow={true} />
    </ErrorBoundary>
  ),
};

export const WithCustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Custom Error Message</h3>
          <p className="text-red-600">Something went wrong with this component.</p>
        </div>
      }
    >
      <ErrorThrowingComponent shouldThrow={true} />
    </ErrorBoundary>
  ),
};