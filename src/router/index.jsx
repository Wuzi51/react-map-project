import { createBrowserRouter } from 'react-router-dom';
import { Home, Favorite, Review } from '../pages';
import { NotFound } from '../pages';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/favorite',
        element: <Favorite />,
      },
      {
        path: '/review',
        element: <Review />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
