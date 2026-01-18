import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface InfiniteScrollProps<T> {
  items: T[];
  hasMore: boolean;
  loadMore: () => void | Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  threshold?: number;
  className?: string;
  loaderClassName?: string;
}

export default function InfiniteScroll<T>({
  items,
  hasMore,
  loadMore,
  renderItem,
  loadingComponent,
  endMessage,
  threshold = 100,
  className = '',
  loaderClassName = '',
}: InfiniteScrollProps<T>) {
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultLoadingComponent = (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-2 text-gray-600">Loading more...</span>
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-8 text-gray-500">
      You've reached the end!
    </div>
  );

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      await loadMore();
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      {
        root: containerRef.current,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, loading, threshold]);

  return (
    <div ref={containerRef} className={`overflow-auto ${className}`}>
      {items.map((item, index) => renderItem(item, index))}

      <div ref={loaderRef} className={loaderClassName}>
        {loading && (loadingComponent || defaultLoadingComponent)}
      </div>

      {!hasMore && !loading && items.length > 0 && (endMessage || defaultEndMessage)}
    </div>
  );
}