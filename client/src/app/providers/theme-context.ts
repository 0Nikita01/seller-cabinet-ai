import { createContext, useContext } from 'react';

export type AppColorScheme = 'light' | 'dark';

export type ThemeContextValue = {
  colorScheme: AppColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: AppColorScheme) => void;
};

export const THEME_STORAGE_KEY = 'seller-cabinet-theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context;
};