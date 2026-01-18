'use client';

import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * ResponsiveFormField Props
 */
export interface ResponsiveFormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'responsive';
}

/**
 * ResponsiveFormField component
 */
export function ResponsiveFormField({
  label,
  children,
  error,
  hint,
  required = false,
  className = '',
  layout = 'responsive',
}: ResponsiveFormFieldProps) {
  const layoutClasses = {
    vertical: 'flex flex-col space-y-2',
    horizontal: 'flex flex-row items-center space-x-4',
    responsive: 'flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      <label className="font-medium text-gray-700 md:w-48 md:flex-shrink-0">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex-1">
        {children}
        {hint && !error && (
          <p className="text-sm text-gray-500 mt-1">{hint}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

/**
 * ResponsiveInput Props
 */
export interface ResponsiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  error?: boolean;
}

/**
 * ResponsiveInput component
 */
export function ResponsiveInput({
  fullWidth = true,
  error = false,
  className = '',
  ...props
}: ResponsiveInputProps) {
  const isMobile = useIsMobile();

  return (
    <input
      className={`
        px-3 py-2 md:px-4 md:py-2.5
        text-sm md:text-base
        border rounded-lg
        transition-colors duration-200
        ${fullWidth ? 'w-full' : ''}
        ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${className}
      `}
      {...props}
    />
  );
}

/**
 * ResponsiveTextarea Props
 */
export interface ResponsiveTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  error?: boolean;
  autoResize?: boolean;
}

/**
 * ResponsiveTextarea component
 */
export function ResponsiveTextarea({
  fullWidth = true,
  error = false,
  autoResize = false,
  className = '',
  ...props
}: ResponsiveTextareaProps) {
  return (
    <textarea
      className={`
        px-3 py-2 md:px-4 md:py-2.5
        text-sm md:text-base
        border rounded-lg
        transition-colors duration-200
        ${fullWidth ? 'w-full' : ''}
        ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${autoResize ? 'resize-none' : 'resize-y'}
        ${className}
      `}
      {...props}
    />
  );
}

/**
 * ResponsiveSelect Props
 */
export interface ResponsiveSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
  error?: boolean;
  options: Array<{ value: string; label: string }>;
}

/**
 * ResponsiveSelect component
 */
export function ResponsiveSelect({
  fullWidth = true,
  error = false,
  options,
  className = '',
  ...props
}: ResponsiveSelectProps) {
  return (
    <select
      className={`
        px-3 py-2 md:px-4 md:py-2.5
        text-sm md:text-base
        border rounded-lg
        transition-colors duration-200
        ${fullWidth ? 'w-full' : ''}
        ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/**
 * ResponsiveFormGroup component
 */
export interface ResponsiveFormGroupProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ResponsiveFormGroup({
  children,
  title,
  description,
  className = '',
}: ResponsiveFormGroupProps) {
  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm md:text-base text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4 md:space-y-6">{children}</div>
    </div>
  );
}

/**
 * ResponsiveFormActions component
 */
export interface ResponsiveFormActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  stack?: boolean;
  className?: string;
}

export function ResponsiveFormActions({
  children,
  align = 'right',
  stack = false,
  className = '',
}: ResponsiveFormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`
        flex
        ${stack ? 'flex-col space-y-3' : 'flex-col sm:flex-row'}
        ${stack ? '' : 'space-y-3 sm:space-y-0 sm:space-x-3'}
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
