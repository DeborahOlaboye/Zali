import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncOperation } from '../useAsyncOperation';

describe('useAsyncOperation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should handle successful async operation', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncOperation());

    act(() => {
      result.current.execute(mockOperation);
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should handle failed async operation', async () => {
    const mockError = new Error('Operation failed');
    const mockOperation = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() =>
      useAsyncOperation({
        retries: 0, // Disable retries for this test
      })
    );

    act(() => {
      result.current.execute(mockOperation);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should retry on failure', async () => {
    const mockOperation = jest
      .fn()
      .mockRejectedValueOnce(new Error('First fail'))
      .mockRejectedValueOnce(new Error('Second fail'))
      .mockResolvedValue('success');

    const { result } = renderHook(() =>
      useAsyncOperation({
        retries: 3,
        retryDelay: 100,
      })
    );

    act(() => {
      result.current.execute(mockOperation);
    });

    // Fast-forward through retry delays
    await act(async () => {
      jest.advanceTimersByTime(100);
      await Promise.resolve();
      jest.advanceTimersByTime(100);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockOperation).toHaveBeenCalledTimes(3);
    expect(result.current.data).toBe('success');
    expect(result.current.retryCount).toBe(2);
  });

  it('should timeout after specified duration', async () => {
    const mockOperation = jest.fn(() => new Promise(() => {})); // Never resolves
    const { result } = renderHook(() =>
      useAsyncOperation({
        timeout: 1000,
        retries: 0,
      })
    );

    act(() => {
      result.current.execute(mockOperation);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('timed out');
  });

  it('should call callbacks on success and error', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onProgress = jest.fn();

    const mockOperation = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() =>
      useAsyncOperation({
        onSuccess,
        onError,
        onProgress,
      })
    );

    await act(async () => {
      await result.current.execute(mockOperation);
    });

    expect(onSuccess).toHaveBeenCalledWith('success');
    expect(onError).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it('should reset state', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncOperation());

    await act(async () => {
      await result.current.execute(mockOperation);
    });

    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should abort operation', async () => {
    const mockOperation = jest.fn(() => new Promise(() => {})); // Never resolves
    const { result } = renderHook(() => useAsyncOperation());

    act(() => {
      result.current.execute(mockOperation);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.abort();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('Operation aborted');
  });

  it('should update progress manually', () => {
    const onProgress = jest.fn();
    const { result } = renderHook(() =>
      useAsyncOperation({
        onProgress,
      })
    );

    act(() => {
      result.current.updateProgress(50);
    });

    expect(result.current.progress).toBe(50);
    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it('should be idle initially', () => {
    const { result } = renderHook(() => useAsyncOperation());

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });
});
