import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  className = '',
  maxHeight = '200px',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = selectedOptions.length > 0
    ? `${selectedOptions.length} selected`
    : placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.slice(0, 2).map(option => (
            <span
              key={option.value}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {option.label}
              <button
                type="button"
                className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                onClick={(e) => handleRemove(option.value, e)}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedOptions.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              +{selectedOptions.length - 2} more
            </span>
          )}
          {selectedOptions.length === 0 && (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                      option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (!option.disabled) {
                        handleSelect(option.value);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <CheckIcon className="w-5 h-5 text-indigo-600" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {selectedOptions.length > 0 && (
            <div className="border-t border-gray-200">
              <button
                type="button"
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleClearAll}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}