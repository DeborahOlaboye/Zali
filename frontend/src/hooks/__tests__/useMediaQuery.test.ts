import { renderHook, act } from '@testing-library/react';
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  useViewport,
  useOrientation,
} from '../useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  });

  it('should return false for non-matching query', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('should return true for matching query', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });
});

describe('useIsMobile', () => {
  it('should return true for mobile viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});

describe('useIsTablet', () => {
  it('should return true for tablet viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(min-width: 769px) and (max-width: 1024px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useIsTablet());
    expect(result.current).toBe(true);
  });
});

describe('useIsDesktop', () => {
  it('should return true for desktop viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(min-width: 1025px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });
});

describe('useBreakpoint', () => {
  it('should return sm for small viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(max-width: 640px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('sm');
  });

  it('should return 2xl for large viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('2xl');
  });
});

describe('useViewport', () => {
  it('should return viewport dimensions', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useViewport());
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should update on window resize', () => {
    const { result } = renderHook(() => useViewport());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1920,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: 1080,
      });

      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(1920);
    expect(result.current.height).toBe(1080);
  });
});

describe('useOrientation', () => {
  it('should return landscape for wide viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe('landscape');
  });

  it('should return portrait for tall viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useOrientation());
    expect(result.current).toBe('portrait');
  });
});
