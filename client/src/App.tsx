import React, { useContext, useEffect } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import AuthContext from './context/AuthContext';

import BrowserRoutes from './routes';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './layout/PrivateLayout';

import Landing from './views/Landing';
import Login from './views/Login';
import NotFound from './views/NotFound';

import './styles/custom.scss';

const App: React.FC = () => {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);

  const notSignedRouter: RouteObject[] = [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '/signin',
      element: <Login />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ];

  const signedRouter: RouteObject[] = [
    {
      path: '/', // ROUTES.ROOT='/'
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: BrowserRoutes
        }
      ]
    },
    {
      path: '*', // ROUTES.ALL_ROUTES='*'
      element: <NotFound />
    }
  ];

  const getBrowserRouter = () => {
    if (signed) {
      console.log('app signed');
      return createBrowserRouter(signedRouter);
    }
    console.log('app not signed');
    return createBrowserRouter(notSignedRouter);
  };

  const browserRouter = getBrowserRouter();

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
  }, []);

  return (
    <RouterProvider router={browserRouter} />
  );
};

export default App;
