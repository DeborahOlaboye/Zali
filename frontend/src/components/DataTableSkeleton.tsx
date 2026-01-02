'use client';

import { motion } from 'framer-motion';

/**
 * DataTableSkeleton Props
 */
export interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

/**
 * DataTableSkeleton component for table loading states
 */
export function DataTableSkeleton({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = '',
}: DataTableSkeletonProps) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      {hasHeader && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <motion.div
                key={`header-${index}`}
                className="h-4 bg-gray-300 rounded"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <motion.div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 bg-gray-200 rounded"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: rowIndex * 0.1 + colIndex * 0.05,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ListSkeleton component for list loading states
 */
export function ListSkeleton({
  items = 5,
  hasAvatar = true,
  className = '',
}: {
  items?: number;
  hasAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={`list-item-${index}`}
          className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {hasAvatar && (
            <motion.div
              className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          <div className="flex-1 space-y-2">
            <motion.div
              className="h-4 bg-gray-300 rounded w-3/4"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
            <motion.div
              className="h-3 bg-gray-200 rounded w-1/2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * FormSkeleton component for form loading states
 */
export function FormSkeleton({
  fields = 4,
  hasSubmitButton = true,
  className = '',
}: {
  fields?: number;
  hasSubmitButton?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={`form-field-${index}`} className="space-y-2">
          <motion.div
            className="h-4 bg-gray-300 rounded w-1/4"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
          <motion.div
            className="h-10 bg-gray-200 rounded-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1 + 0.05,
            }}
          />
        </div>
      ))}

      {hasSubmitButton && (
        <motion.div
          className="h-12 bg-blue-300 rounded-lg w-full"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}
