'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * MobileMenu Props
 */
export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  overlay?: boolean;
  className?: string;
}

/**
 * MobileMenu component with slide-in animation
 */
export function MobileMenu({
  isOpen,
  onClose,
  children,
  position = 'right',
  overlay = true,
  className = '',
}: MobileMenuProps) {
  const isMobile = useIsMobile();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isMobile) return null;

  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  };

  const positionClasses = {
    left: 'left-0 top-0 h-full w-80',
    right: 'right-0 top-0 h-full w-80',
    top: 'top-0 left-0 w-full h-80',
    bottom: 'bottom-0 left-0 w-full h-80',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
          )}

          {/* Menu */}
          <motion.div
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed ${positionClasses[position]} bg-white shadow-xl z-50 overflow-y-auto ${className}`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="p-6 pt-16">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * MobileMenuButton component
 */
export interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}

export function MobileMenuButton({
  onClick,
  isOpen = false,
  className = '',
}: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-gray-900 ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
}

/**
 * MobileMenuItem component
 */
export interface MobileMenuItemProps {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  className?: string;
}

export function MobileMenuItem({
  icon,
  label,
  onClick,
  href,
  active = false,
  className = '',
}: MobileMenuItemProps) {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      onClick={onClick}
      href={href}
      className={`
        flex items-center space-x-3 w-full px-4 py-3 rounded-lg
        transition-colors duration-200
        ${
          active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        }
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-medium">{label}</span>
    </Component>
  );
}

/**
 * MobileBottomSheet component
 */
export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: string;
  className?: string;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  children,
  maxHeight = '80vh',
  className = '',
}: MobileBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{ maxHeight }}
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 overflow-y-auto ${className}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-safe">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
