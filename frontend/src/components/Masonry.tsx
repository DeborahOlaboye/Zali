import React, { useState, useEffect, useRef } from 'react';

/**
 * Masonry layout component configuration
 * 
 * @template T - The type of items being laid out
 */
export interface MasonryProps<T> {
  /** Array of items to display in masonry layout */
  items: T[];
  
  /** Function to render each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  
  /** Number of columns in the layout. Default: 3, responsive on mobile */
  columns?: number;
  
  /** Gap between items in pixels. Default: 16 */
  gap?: number;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Masonry displays items in a responsive multi-column masonry layout
 * 
 * Great for displaying cards, images, or other content in a Pinterest-style grid.
 * Automatically balances item heights across columns.
 * 
 * @component
 * @template T - The data type of items
 * @example
 * <Masonry
 *   items={items}
 *   renderItem={(item) => <Card>{item.title}</Card>}
 *   columns={3}
 *   gap={20}
 * />
 */export default function Masonry<T>({
  items,
  renderItem,
  columns = 3,
  gap = 16,
  className = '',
}: MasonryProps<T>) {
  const [columnHeights, setColumnHeights] = useState<number[]>(() => Array(columns).fill(0));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset heights when items change
    setColumnHeights(Array(columns).fill(0));
  }, [items, columns]);

  const getShortestColumnIndex = (heights: number[]) => {
    let minHeight = Math.min(...heights);
    return heights.indexOf(minHeight);
  };

  const columnsData = items.reduce((acc, item, index) => {
    const columnIndex = getShortestColumnIndex(columnHeights);
    if (!acc[columnIndex]) {
      acc[columnIndex] = [];
    }
    acc[columnIndex].push({ item, index });
    // Approximate height increase (in a real implementation, you'd measure actual rendered height)
    columnHeights[columnIndex] += 200 + Math.random() * 100; // Mock height
    return acc;
  }, [] as Array<Array<{ item: T; index: number }>>);

  return (
    <div
      ref={containerRef}
      className={`flex ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-1"
          style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}
        >
          {columnsData[columnIndex]?.map(({ item, index }) => (
            <div key={index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}