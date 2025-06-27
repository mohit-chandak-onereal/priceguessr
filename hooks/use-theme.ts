'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return {
      theme: undefined,
      setTheme,
      resolvedTheme: undefined,
      isDark: true, // Default to dark theme
      isLight: false,
      toggleTheme: () => {},
    };
  }

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    isDark,
    isLight,
    toggleTheme,
  };
}