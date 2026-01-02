import { useState, useEffect } from 'react';

/**
 * Hook to detect media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)');
}

export function useIsSmallMobile() {
  return useMediaQuery('(max-width: 480px)');
}

export function useIsLargeMobile() {
  return useMediaQuery('(min-width: 481px) and (max-width: 768px)');
}

/**
 * Hook to get current breakpoint
 */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useBreakpoint(): Breakpoint {
  const isSm = useMediaQuery('(max-width: 640px)');
  const isMd = useMediaQuery('(min-width: 641px) and (max-width: 768px)');
  const isLg = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1025px) and (max-width: 1280px)');

  if (isSm) return 'sm';
  if (isMd) return 'md';
  if (isLg) return 'lg';
  if (isXl) return 'xl';
  return '2xl';
}

/**
 * Hook to get viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Set initial values
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}

/**
 * Hook to detect orientation
 */
export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
      ? 'landscape'
      : 'portrait'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
}
