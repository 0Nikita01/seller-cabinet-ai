import { type ReactNode } from 'react';
import { MantineProvider, createTheme, Loader } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './query-client';
import { RingLoader } from '../../shared/ui/ring-loader/ring-loader';

const inputStyles = {
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    color: '#2f2f35',
    fontSize: '18px',
    height: '42px',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: '16px',
    marginBottom: '6px',
  }
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
    NumberInput: {
      styles: inputStyles,
    },
  },
});

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};
