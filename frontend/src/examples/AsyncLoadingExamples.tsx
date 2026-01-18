'use client';

/**
 * Comprehensive examples for async loading states system
 *
 * This file demonstrates various use cases for the async loading states system.
 */

import { useState } from 'react';
import {
  useAsyncOperation,
  useAsyncBatch,
  useAsyncData,
  useAsyncMutation,
  AsyncBoundary,
  RetryableOperation,
  RetryUI,
  DataTableSkeleton,
  ListSkeleton,
  FormSkeleton,
  OperationProgress,
  CompactOperationProgress,
} from '@/async';
import { LoadingButton } from '@/components/LoadingButton';

/**
 * Example 1: Basic Async Operation with Retry
 */
export function BasicAsyncExample() {
  const {
    data,
    isLoading,
    isError,
    error,
    execute,
    retry,
  } = useAsyncOperation({
    retries: 3,
    retryDelay: 1000,
    timeout: 10000,
  });

  const handleFetch = async () => {
    try {
      await execute(async () => {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      });
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Basic Async Operation</h3>

      <LoadingButton onClick={handleFetch} isLoading={isLoading}>
        Fetch Data
      </LoadingButton>

      {isLoading && <p className="text-blue-600">Loading...</p>}
      {isError && (
        <div className="text-red-600">
          <p>Error: {error?.message}</p>
          <button
            onClick={() => execute(async () => fetch('/api/data').then(r => r.json()))}
            className="mt-2 text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      )}
      {data && <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

/**
 * Example 2: Data Fetching with Caching
 */
export function DataFetchingExample({ userId }: { userId: string }) {
  const {
    data,
    isLoading,
    isFetching,
    isStale,
    refetch,
    invalidate,
  } = useAsyncData(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    },
    {
      cacheKey: `user-${userId}`,
      cacheTime: 5 * 60 * 1000,
      staleTime: 1 * 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Fetching with Cache</h3>
        {isFetching && !isLoading && <span className="text-sm text-blue-600">Refreshing...</span>}
        {isStale && <span className="text-sm text-yellow-600">Data is stale</span>}
      </div>

      {isLoading ? (
        <ListSkeleton items={1} hasAvatar={true} />
      ) : data ? (
        <div className="bg-gray-50 p-4 rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refetch
        </button>
        <button
          onClick={() => invalidate()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Invalidate Cache
        </button>
      </div>
    </div>
  );
}

/**
 * Example 3: Form Mutation with Optimistic Updates
 */
export function FormMutationExample() {
  const [name, setName] = useState('');

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    mutate,
    reset,
  } = useAsyncMutation(
    async (formData: { name: string }) => {
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    {
      optimisticUpdate: (formData) => formData,
      rollbackOnError: true,
      invalidateQueries: ['user-data'],
      onSuccess: () => {
        console.log('Updated successfully!');
        setName('');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name });
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Form Mutation</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <LoadingButton type="submit" isLoading={isLoading}>
          Save Changes
        </LoadingButton>
      </form>

      {isSuccess && <p className="text-green-600">Updated successfully!</p>}
      {isError && <p className="text-red-600">Error: {error?.message}</p>}
      {data && <p className="text-sm text-gray-600">Optimistic data: {JSON.stringify(data)}</p>}
    </div>
  );
}

/**
 * Example 4: Batch Operations
 */
export function BatchOperationsExample() {
  const {
    results,
    errors,
    isLoading,
    progress,
    completedCount,
    totalCount,
    executeBatch,
  } = useAsyncBatch({
    concurrent: 3,
    stopOnError: false,
    onProgress: (p) => console.log(`Progress: ${p}%`),
  });

  const handleBatch = async () => {
    const operations = Array.from({ length: 10 }, (_, i) => async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (i === 5) throw new Error(`Item ${i} failed`);
      return { id: i, data: `Result ${i}` };
    });

    await executeBatch(operations);
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Batch Operations</h3>

      <LoadingButton onClick={handleBatch} isLoading={isLoading}>
        Execute Batch
      </LoadingButton>

      {isLoading && (
        <CompactOperationProgress label="Processing batch" progress={progress} />
      )}

      {completedCount > 0 && (
        <p className="text-sm text-gray-600">
          Completed: {completedCount} / {totalCount}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Results:</h4>
          {results.map((result, index) => (
            <div key={index} className="text-sm">
              {result ? (
                <span className="text-green-600">✓ {JSON.stringify(result)}</span>
              ) : errors[index] ? (
                <span className="text-red-600">✗ {errors[index]?.message}</span>
              ) : (
                <span className="text-gray-400">Pending...</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Multi-Step Operation with Progress
 */
export function MultiStepOperationExample() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { label: 'Preparing', description: 'Setting up the operation' },
    { label: 'Processing', description: 'Processing your request' },
    { label: 'Finalizing', description: 'Finishing up' },
    { label: 'Complete', description: 'Operation completed' },
  ];

  const handleStart = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);

      // Simulate step progress
      for (let p = 0; p <= 100; p += 10) {
        setProgress((i * 100 + p) / steps.length);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Multi-Step Operation</h3>

      <LoadingButton onClick={handleStart} isLoading={isRunning}>
        Start Operation
      </LoadingButton>

      {(isRunning || progress > 0) && (
        <OperationProgress
          steps={steps}
          currentStep={currentStep}
          progress={progress}
          isLoading={isRunning}
        />
      )}
    </div>
  );
}

/**
 * Example 6: Retryable Operation with Custom UI
 */
export function RetryableOperationExample() {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Retryable Operation</h3>

      <RetryableOperation
        operation={async () => {
          const response = await fetch('/api/unreliable');
          if (!response.ok) throw new Error('Request failed');
          return response.json();
        }}
        maxRetries={3}
        retryDelay={1000}
        autoRetry={false}
      >
        {({ data, isLoading, isError, error, retry, retryCount, reset }) => (
          <div className="space-y-4">
            {isLoading && <p className="text-blue-600">Loading...</p>}

            {isError && (
              <RetryUI
                error={error}
                onRetry={retry}
                retryCount={retryCount}
                maxRetries={3}
                isLoading={isLoading}
              />
            )}

            {data && (
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <p className="text-green-800 font-medium">Success!</p>
                <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
                <button
                  onClick={reset}
                  className="mt-4 text-blue-600 underline text-sm"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}
      </RetryableOperation>
    </div>
  );
}

/**
 * Example 7: Skeleton Loaders Showcase
 */
export function SkeletonLoadersExample() {
  const [showData, setShowData] = useState(false);

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Skeleton Loaders</h3>

      <button
        onClick={() => setShowData(!showData)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Toggle Loading State
      </button>

      <div className="space-y-8">
        <div>
          <h4 className="font-medium mb-4">Table Skeleton</h4>
          {!showData ? (
            <DataTableSkeleton rows={5} columns={4} hasHeader={true} />
          ) : (
            <div className="border rounded-lg p-4">
              <p>Table data would appear here</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-4">List Skeleton</h4>
          {!showData ? (
            <ListSkeleton items={3} hasAvatar={true} />
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded">
                  List item {i + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium mb-4">Form Skeleton</h4>
          {!showData ? (
            <FormSkeleton fields={4} hasSubmitButton={true} />
          ) : (
            <form className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Field ${i + 1}`}
                  className="w-full px-4 py-2 border rounded"
                />
              ))}
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Example 8: Async Boundary with Error Recovery
 */
export function AsyncBoundaryExample() {
  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Async Boundary</h3>

      <AsyncBoundary
        loadingFallback={<ListSkeleton items={3} hasAvatar={true} />}
        errorFallback={
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 font-medium">Something went wrong</p>
            <p className="text-red-600 text-sm mt-2">Please try again later</p>
          </div>
        }
        onError={(error) => console.error('Boundary caught error:', error)}
        onReset={() => console.log('Boundary reset')}
      >
        <AsyncContent />
      </AsyncBoundary>
    </div>
  );
}

// Simulated async component
function AsyncContent() {
  // This would normally be a component that uses Suspense
  return (
    <div className="bg-green-50 border border-green-200 rounded p-4">
      <p className="text-green-800">Content loaded successfully!</p>
    </div>
  );
}

/**
 * Main Examples Component
 */
export default function AsyncLoadingExamples() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Async Loading States Examples
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive examples of the async loading states system
          </p>
        </div>

        <BasicAsyncExample />
        <DataFetchingExample userId="123" />
        <FormMutationExample />
        <BatchOperationsExample />
        <MultiStepOperationExample />
        <RetryableOperationExample />
        <SkeletonLoadersExample />
        <AsyncBoundaryExample />
      </div>
    </div>
  );
}
