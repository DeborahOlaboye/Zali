'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <ComputerDesktopIcon className="w-5 h-5" />;
    }
    return resolvedTheme === 'dark' ? (
      <MoonIcon className="w-5 h-5" />
    ) : (
      <SunIcon className="w-5 h-5" />
    );
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors duration-200"
      aria-label={`Current theme: ${getLabel()}. Click to switch theme.`}
      title={`Switch theme (current: ${getLabel()})`}
    >
      {getIcon()}
      <span className="text-sm font-medium hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
