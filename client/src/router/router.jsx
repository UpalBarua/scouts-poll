import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home';
import RootLayout from '../layouts/root-layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

export default router;