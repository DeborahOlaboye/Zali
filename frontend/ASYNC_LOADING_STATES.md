# Async Loading States Documentation

This document provides comprehensive documentation for the async loading states system implemented in the application.

## Table of Contents

1. [Overview](#overview)
2. [Hooks](#hooks)
3. [Components](#components)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Overview

The async loading states system provides a comprehensive solution for managing asynchronous operations in React applications. It includes:

- **Hooks** for managing async operations, mutations, and data fetching
- **Components** for displaying loading states, errors, and progress
- **Utilities** for retry logic, caching, and batch operations

### Key Features

- ✅ Comprehensive state management for async operations
- ✅ Retry logic with configurable attempts and delays
- ✅ Timeout handling with abort functionality
- ✅ Progress tracking for multi-step operations
- ✅ Caching with stale-while-revalidate pattern
- ✅ Optimistic updates for mutations
- ✅ Batch operations with concurrency control
- ✅ Skeleton loaders for better UX
- ✅ Error boundaries with retry functionality

---

## Hooks

### useAsyncOperation

Hook for managing async operations with loading states, retries, and timeout.

**Features:**
- Retry logic with exponential backoff
- Timeout handling
- Progress tracking
- Abort functionality
- Success/error callbacks

**Usage:**

```typescript
import { useAsyncOperation } from '@/async';

function MyComponent() {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    execute,
    reset,
    abort,
  } = useAsyncOperation({
    retries: 3,
    retryDelay: 1000,
    timeout: 30000,
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error),
  });

  const handleClick = async () => {
    try {
      const result = await execute(async () => {
        const response = await fetch('/api/data');
        return response.json();
      });
      console.log('Result:', result);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Fetch Data</button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {isSuccess && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  );
}
```

---

### useAsyncBatch

Hook for executing multiple async operations in batch with progress tracking.

**Features:**
- Concurrent execution with configurable limit
- Progress tracking for each operation
- Stop-on-error functionality
- Individual operation callbacks

**Usage:**

```typescript
import { useAsyncBatch } from '@/async';

function BatchComponent() {
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
    onProgress: (progress) => console.log(`Progress: ${progress}%`),
    onItemComplete: (index, result) => console.log(`Item ${index} completed:`, result),
  });

  const handleBatch = async () => {
    const operations = [
      () => fetch('/api/item/1').then(r => r.json()),
      () => fetch('/api/item/2').then(r => r.json()),
      () => fetch('/api/item/3').then(r => r.json()),
    ];

    await executeBatch(operations);
  };

  return (
    <div>
      <button onClick={handleBatch}>Execute Batch</button>
      {isLoading && <p>Progress: {progress}% ({completedCount}/{totalCount})</p>}
      {results.map((result, index) => (
        <div key={index}>Result {index}: {JSON.stringify(result)}</div>
      ))}
    </div>
  );
}
```

---

### useAsyncData

Hook for fetching data with caching and auto-refetch capabilities.

**Features:**
- Global caching with configurable TTL
- Stale-while-revalidate pattern
- Auto-refetch on mount, window focus, and intervals
- Optimistic updates

**Usage:**

```typescript
import { useAsyncData } from '@/async';

function DataComponent() {
  const {
    data,
    isLoading,
    isFetching,
    isStale,
    refetch,
    invalidate,
    mutate,
  } = useAsyncData(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    {
      cacheKey: 'my-data',
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000, // 1 minute
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // 30 seconds
    }
  );

  const handleUpdate = () => {
    // Optimistic update
    mutate((oldData) => ({ ...oldData, updated: true }));

    // Invalidate cache to trigger refetch
    invalidate();
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
      {isStale && <p>Data is stale</p>}
      <button onClick={refetch}>Refetch</button>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

---

### useAsyncMutation

Hook for async mutations with optimistic updates and cache invalidation.

**Features:**
- Optimistic updates
- Rollback on error
- Cache invalidation
- Success/error/settled callbacks

**Usage:**

```typescript
import { useAsyncMutation } from '@/async';

function MutationComponent() {
  const {
    data,
    isLoading,
    isSuccess,
    mutate,
    reset,
  } = useAsyncMutation(
    async (variables: { name: string }) => {
      const response = await fetch('/api/update', {
        method: 'POST',
        body: JSON.stringify(variables),
      });
      return response.json();
    },
    {
      onSuccess: (data, variables) => {
        console.log('Mutation successful:', data);
      },
      onError: (error, variables) => {
        console.error('Mutation failed:', error);
      },
      invalidateQueries: ['my-data', 'other-data'],
      optimisticUpdate: (variables) => ({ name: variables.name, pending: true }),
      rollbackOnError: true,
    }
  );

  const handleMutate = async () => {
    try {
      await mutate({ name: 'New Name' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleMutate} disabled={isLoading}>
        Update
      </button>
      {isSuccess && <p>Updated successfully!</p>}
    </div>
  );
}
```

---

## Components

### AsyncBoundary

Component that combines Suspense and ErrorBoundary for comprehensive async handling.

**Usage:**

```typescript
import { AsyncBoundary } from '@/async';
import { LoadingSpinner } from '@/components/loading';

function MyComponent() {
  return (
    <AsyncBoundary
      loadingFallback={<LoadingSpinner size="lg" />}
      errorFallback={<ErrorDisplay />}
      onError={(error) => console.error('Error:', error)}
      onReset={() => console.log('Reset')}
    >
      <AsyncContent />
    </AsyncBoundary>
  );
}
```

---

### RetryableOperation

Render prop component for operations with retry capability.

**Usage:**

```typescript
import { RetryableOperation, RetryUI } from '@/async';

function MyComponent() {
  return (
    <RetryableOperation
      operation={async () => {
        const response = await fetch('/api/data');
        return response.json();
      }}
      maxRetries={3}
      retryDelay={1000}
      autoRetry={false}
      onSuccess={(data) => console.log('Success:', data)}
    >
      {({ data, isLoading, isError, error, retry, retryCount }) => (
        <div>
          {isLoading && <p>Loading...</p>}
          {isError && (
            <RetryUI
              error={error}
              onRetry={retry}
              retryCount={retryCount}
              maxRetries={3}
              isLoading={isLoading}
            />
          )}
          {data && <p>Data: {JSON.stringify(data)}</p>}
        </div>
      )}
    </RetryableOperation>
  );
}
```

---

### Skeleton Loaders

Components for displaying loading states with skeleton loaders.

**DataTableSkeleton:**

```typescript
import { DataTableSkeleton } from '@/async';

<DataTableSkeleton rows={5} columns={4} hasHeader={true} />
```

**ListSkeleton:**

```typescript
import { ListSkeleton } from '@/async';

<ListSkeleton items={5} hasAvatar={true} />
```

**FormSkeleton:**

```typescript
import { FormSkeleton } from '@/async';

<FormSkeleton fields={4} hasSubmitButton={true} />
```

---

### OperationProgress

Component for visualizing multi-step async operations.

**Usage:**

```typescript
import { OperationProgress } from '@/async';

function MyComponent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Preparing', description: 'Setting up the operation' },
    { label: 'Processing', description: 'Processing your request' },
    { label: 'Finalizing', description: 'Finishing up' },
  ];

  return (
    <OperationProgress
      steps={steps}
      currentStep={currentStep}
      progress={progress}
      isLoading={true}
    />
  );
}
```

---

## Usage Examples

### Example 1: Data Fetching with Caching

```typescript
import { useAsyncData } from '@/async';

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useAsyncData(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    {
      cacheKey: `user-${userId}`,
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 2 * 60 * 1000, // 2 minutes
      enabled: !!userId,
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay error={error} onRetry={refetch} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
```

### Example 2: Form Submission with Optimistic Updates

```typescript
import { useAsyncMutation } from '@/async';

function UpdateForm({ initialData }: { initialData: any }) {
  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useAsyncMutation(
    async (formData) => {
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
        toast.success('Updated successfully!');
      },
      onError: (error) => {
        toast.error(`Update failed: ${error.message}`);
      },
    }
  );

  const handleSubmit = (formData: any) => {
    mutate(formData);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(Object.fromEntries(new FormData(e.currentTarget)));
    }}>
      {/* Form fields */}
      <LoadingButton type="submit" isLoading={isLoading}>
        Save Changes
      </LoadingButton>
      {isError && <ErrorMessage>{error?.message}</ErrorMessage>}
      {isSuccess && <SuccessMessage>Saved!</SuccessMessage>}
    </form>
  );
}
```

### Example 3: Batch Operations

```typescript
import { useAsyncBatch } from '@/async';

function BatchUpload({ files }: { files: File[] }) {
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
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress}%`);
    },
    onItemComplete: (index, result) => {
      console.log(`File ${index + 1} uploaded:`, result);
    },
    onItemError: (index, error) => {
      console.error(`File ${index + 1} failed:`, error);
    },
  });

  const handleUpload = async () => {
    const operations = files.map((file) => async () => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload ${file.name}`);
      return response.json();
    });

    await executeBatch(operations);
  };

  return (
    <div>
      <button onClick={handleUpload} disabled={isLoading}>
        Upload {files.length} Files
      </button>

      {isLoading && (
        <CompactOperationProgress
          label="Uploading files"
          progress={progress}
        />
      )}

      {completedCount > 0 && (
        <p>{completedCount} of {totalCount} files uploaded</p>
      )}

      {errors.some(e => e !== null) && (
        <div>
          <h3>Errors:</h3>
          {errors.map((error, index) =>
            error && <p key={index}>{files[index].name}: {error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Use Appropriate Hooks for Each Use Case

- **useAsyncData** - For data fetching with caching
- **useAsyncMutation** - For mutations with optimistic updates
- **useAsyncOperation** - For one-off operations with retry logic
- **useAsyncBatch** - For batch operations

### 2. Configure Caching Properly

```typescript
// Short-lived data (user input, form state)
cacheTime: 1 * 60 * 1000, // 1 minute
staleTime: 0, // Always stale

// Medium-lived data (user profile, settings)
cacheTime: 10 * 60 * 1000, // 10 minutes
staleTime: 2 * 60 * 1000, // 2 minutes

// Long-lived data (static content, configurations)
cacheTime: 60 * 60 * 1000, // 1 hour
staleTime: 30 * 60 * 1000, // 30 minutes
```

### 3. Handle Errors Gracefully

```typescript
const { data, isError, error, refetch } = useAsyncData(fetchData, {
  onError: (error) => {
    // Log error
    console.error('Fetch error:', error);

    // Show user-friendly message
    toast.error('Failed to load data. Please try again.');

    // Track error
    trackError(error);
  },
});
```

### 4. Use Skeleton Loaders

```typescript
function MyComponent() {
  const { data, isLoading } = useAsyncData(fetchData);

  if (isLoading) {
    return <DataTableSkeleton rows={5} columns={4} />;
  }

  return <DataTable data={data} />;
}
```

### 5. Implement Retry Logic

```typescript
const { execute } = useAsyncOperation({
  retries: 3,
  retryDelay: 1000,
  onError: (error) => {
    if (error.message.includes('network')) {
      // Network error - retry is appropriate
      return;
    }

    // Other errors - don't retry
    throw error;
  },
});
```

---

## Testing

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncOperation } from '@/async';

describe('useAsyncOperation', () => {
  it('should handle successful operation', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncOperation());

    await result.current.execute(mockOperation);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe('success');
    });
  });
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import { RetryableOperation } from '@/async';

describe('RetryableOperation', () => {
  it('should render loading state', () => {
    render(
      <RetryableOperation operation={async () => {}}>
        {({ isLoading }) => (
          isLoading ? <div>Loading...</div> : <div>Done</div>
        )}
      </RetryableOperation>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### Issue: Cache Not Invalidating

**Solution:** Ensure you're using the same cache key for both data fetching and invalidation:

```typescript
// Fetching
const { data } = useAsyncData(fetchData, { cacheKey: 'my-data' });

// Invalidating
const { mutate } = useAsyncMutation(updateData, {
  invalidateQueries: ['my-data'], // Must match cache key
});
```

### Issue: Retry Not Working

**Solution:** Check retry configuration and error type:

```typescript
const { execute } = useAsyncOperation({
  retries: 3,
  retryDelay: 1000,
  // Make sure error is thrown, not just returned
  onError: (error) => {
    console.error('Retry failed:', error);
  },
});
```

### Issue: Memory Leaks

**Solution:** Ensure proper cleanup by using the abort function:

```typescript
useEffect(() => {
  const { execute, abort } = useAsyncOperation();

  execute(myOperation);

  return () => {
    abort(); // Clean up on unmount
  };
}, []);
```

---

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [SWR Documentation](https://swr.vercel.app/)
- [React Suspense Documentation](https://react.dev/reference/react/Suspense)

---

For more information or questions, please refer to the code documentation or open an issue on GitHub.
