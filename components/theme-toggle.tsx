'use client';

import { useTheme } from '@/hooks/use-theme';
import { clsx } from 'clsx';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'relative inline-flex h-7 w-14 items-center rounded-full',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2',
        'button-press',
        className
      )}
      style={{
        backgroundColor: 'rgb(var(--surface))',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full',
          'transition-transform duration-200',
          isDark ? 'translate-x-8' : 'translate-x-1'
        )}
        style={{
          backgroundColor: 'rgb(var(--primary))',
        }}
      >
        <span className="flex h-full w-full items-center justify-center text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
}