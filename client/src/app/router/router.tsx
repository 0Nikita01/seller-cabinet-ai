import { createBrowserRouter } from 'react-router-dom';

import MainPage from '../../pages/main-page/main-page';
import ListingsPage from '../../pages/listings-page/listings-page';
import ListingDetailsPage from '../../pages/listing-details-page/listing-details-page';
import ListingEditPage from '../../pages/listing-edit-page/listing-edit-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/ads',
    element: <ListingsPage />,
  },
  {
    path: '/ads/:id',
    element: <ListingDetailsPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <ListingEditPage />,
  },
]);
