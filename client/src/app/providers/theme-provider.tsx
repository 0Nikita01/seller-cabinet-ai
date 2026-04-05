import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { type AppColorScheme, THEME_STORAGE_KEY, ThemeContext } from './theme-context';

type ThemeProviderProps = {
  children: ReactNode;
};

const getInitialColorScheme = (): AppColorScheme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorSchemeState] = useState<AppColorScheme>(() =>
    getInitialColorScheme(),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = colorScheme;
    localStorage.setItem(THEME_STORAGE_KEY, colorScheme);
  }, [colorScheme]);

  const setColorScheme = (scheme: AppColorScheme) => {
    setColorSchemeState(scheme);
  };

  const toggleColorScheme = () => {
    setColorSchemeState((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(
    () => ({
      colorScheme,
      toggleColorScheme,
      setColorScheme,
    }),
    [colorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
