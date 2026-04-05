import { type ReactNode } from 'react';
import { MantineProvider, createTheme, Loader } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './query-client';
import { RingLoader } from '../../shared/ui/ring-loader/ring-loader';
import { ThemeProvider } from './theme-provider';
import { useAppTheme } from './theme-context';

const inputStyles = {
  input: {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border-soft)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    height: '42px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    marginBottom: '6px',
  },
};

const checkboxStyles = {
  label: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
};

const theme = createTheme({
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  },
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
    TextInput: {
      styles: inputStyles,
    },
    Textarea: {
      styles: inputStyles,
    },
    Select: {
      styles: inputStyles,
    },
    Checkbox: {
      styles: checkboxStyles,
    },
    NumberInput: {
      styles: inputStyles,
    },
  },
});

type AppProviderProps = {
  children: ReactNode;
};

const InnerProviders = ({ children }: AppProviderProps) => {
  const { colorScheme } = useAppTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  );
};
