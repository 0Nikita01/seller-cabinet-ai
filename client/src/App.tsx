import { RouterProvider } from 'react-router-dom';

import { AppProvider } from './app/providers/app-provider';
import { router } from './app/router/router';

const App = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
