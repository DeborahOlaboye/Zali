import { renderHook, act } from '@testing-library/react';
import { useTransactionLoading } from '@/hooks/useTransactionLoading';

jest.useFakeTimers();

describe('useTransactionLoading', () => {
  it('starts and progresses', () => {
    const { result } = renderHook(() => useTransactionLoading({ enableProgressTracking: true, updateInterval: 100 }));

    act(() => {
      result.current.state; // initial
      // start loading
      (result.current as any).startLoading();
    });

    expect(result.current.isLoading).toBe(true);

    // advance timers to let progress increase
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.progress).toBeGreaterThan(0);

    // mark success
    act(() => {
      (result.current as any).markSuccess();
    });

    expect(result.current.isSuccess).toBe(true);
  });
});
