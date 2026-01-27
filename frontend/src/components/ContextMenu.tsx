import React, { useState, useRef, useEffect } from 'react';

/**
 * ContextMenu item configuration
 */
export interface ContextMenuItem {
  /** Unique identifier for the menu item */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Optional icon element */
  icon?: React.ReactNode;
  
  /** Whether this item is disabled */
  disabled?: boolean;
  
  /** Whether to show a visual divider */
  divider?: boolean;
  
  /** Nested submenu items */
  children?: ContextMenuItem[];
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  onItemClick?: (item: ContextMenuItem) => void;
  children: React.ReactNode;
  className?: string;
}

export default function ContextMenu({
  items,
  onItemClick,
  children,
  className = '',
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSubmenuOpen(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSubmenuOpen(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setIsOpen(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.divider) return;

    if (item.children) {
      setSubmenuOpen(submenuOpen === item.id ? null : item.id);
    } else {
      onItemClick?.(item);
      setIsOpen(false);
      setSubmenuOpen(null);
    }
  };

  const renderMenuItem = (item: ContextMenuItem, level = 0) => {
    if (item.divider) {
      return <div key={item.id} className="border-t border-gray-200 my-1" />;
    }

    const hasSubmenu = item.children && item.children.length > 0;
    const isSubmenuOpen = submenuOpen === item.id;

    return (
      <div key={item.id} className="relative">
        <button
          className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
            item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${level > 0 ? 'pl-6' : ''}`}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
        >
          <div className="flex items-center">
            {item.icon && <span className="mr-3">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
          {hasSubmenu && (
            <span className="ml-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>

        {hasSubmenu && isSubmenuOpen && (
          <div className="absolute left-full top-0 z-20 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className="cursor-context-menu"
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-48"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {items.map(item => renderMenuItem(item))}
        </div>
      )}
    </div>
  );
}