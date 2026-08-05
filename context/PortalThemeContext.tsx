'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { AppTheme, getStoredTheme, applyGlobalTheme, toggleGlobalTheme } from '@/lib/theme';

interface PortalThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const PortalThemeContext = createContext<PortalThemeContextType | undefined>(undefined);

export function PortalThemeProvider({ children }: { children: ReactNode }) {
  const { setTheme: setNextTheme } = useTheme();
  const [themeState, setThemeState] = useState<AppTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getStoredTheme();
    setThemeState(initial);
    applyGlobalTheme(initial);
    try { setNextTheme(initial); } catch {}
    setMounted(true);
  }, [setNextTheme]);

  const toggleTheme = () => {
    const nextTheme = toggleGlobalTheme(themeState);
    setThemeState(nextTheme);
    try { setNextTheme(nextTheme); } catch {}
  };

  const isDark = themeState === 'dark';

  return (
    <PortalThemeContext.Provider value={{ theme: themeState, toggleTheme, isDark }}>
      {!mounted ? (
        <div style={{ visibility: 'hidden' }}>{children}</div>
      ) : (
        children
      )}
    </PortalThemeContext.Provider>
  );
}

export function usePortalTheme() {
  const context = useContext(PortalThemeContext);
  if (context === undefined) {
    const initial = getStoredTheme();
    const isDark = initial === 'dark';
    return {
      theme: initial,
      toggleTheme: () => toggleGlobalTheme(initial),
      isDark,
    };
  }
  return context;
}
