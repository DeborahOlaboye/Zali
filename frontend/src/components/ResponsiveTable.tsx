'use client';

import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * ResponsiveTable Props
 */
export interface ResponsiveTableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  mobileCardView?: boolean;
  striped?: boolean;
  hover?: boolean;
}

/**
 * Table column definition
 */
export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * ResponsiveTable component that switches to cards on mobile
 */
export function ResponsiveTable({
  columns,
  data,
  className = '',
  mobileCardView = true,
  striped = false,
  hover = false,
}: ResponsiveTableProps) {
  const isMobile = useIsMobile();

  if (isMobile && mobileCardView) {
    return <MobileCardView columns={columns} data={data} className={className} />;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns
              .filter((col) => !col.hideOnMobile || !isMobile)
              .map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                >
                  {column.label}
                </th>
              ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody
          className={`bg-white divide-y divide-gray-200 ${
            striped ? 'divide-y-0' : ''
          }`}
        >
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${hover ? 'hover:bg-gray-100' : ''}
                transition-colors duration-150
              `}
            >
              {columns
                .filter((col) => !col.hideOnMobile || !isMobile)
                .map((column) => (
                  <td
                    key={column.key}
                    className={`
                      px-4 py-4 text-sm text-gray-900
                      ${column.align === 'center' ? 'text-center' : ''}
                      ${column.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}

/**
 * MobileCardView component for mobile display
 */
function MobileCardView({
  columns,
  data,
  className = '',
}: {
  columns: TableColumn[];
  data: any[];
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          {columns
            .filter((col) => !col.hideOnMobile)
            .map((column) => (
              <div key={column.key} className="flex justify-between py-2">
                <span className="text-sm font-medium text-gray-500">
                  {column.mobileLabel || column.label}
                </span>
                <span className="text-sm text-gray-900">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
        </div>
      ))}

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}

/**
 * ResponsiveTableHeader component
 */
export interface ResponsiveTableHeaderProps {
  title: string;
  action?: ReactNode;
  search?: ReactNode;
  className?: string;
}

export function ResponsiveTableHeader({
  title,
  action,
  search,
  className = '',
}: ResponsiveTableHeaderProps) {
  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {search && <div className="mt-4">{search}</div>}
    </div>
  );
}

/**
 * ResponsiveTablePagination component
 */
export interface ResponsiveTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ResponsiveTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: ResponsiveTablePaginationProps) {
  const isMobile = useIsMobile();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = isMobile
    ? pages.filter((p) => Math.abs(p - currentPage) <= 1)
    : pages.filter((p) => Math.abs(p - currentPage) <= 2);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 mt-4 sm:mt-6 ${className}`}
    >
      {/* Info */}
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {/* Page numbers */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium rounded-md
              ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
