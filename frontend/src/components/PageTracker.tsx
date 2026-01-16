'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? '?' + searchParams.toString() : '');
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      path: pathname,
      url: url,
    });
  }, [pathname, searchParams]);

  return null;
}
