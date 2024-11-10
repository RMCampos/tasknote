import React, { useContext, useEffect } from 'react';
import {
  createBrowserRouter, Navigate, RouteObject, RouterProvider
} from 'react-router-dom';
import AuthContext from './context/AuthContext';

import BrowserRoutes from './routes';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './layout/PrivateLayout';

import Landing from './views/Landing';
import Login from './views/Login';
import NotFound from './views/NotFound';
import Register from './views/Register';

import './styles/custom.scss';

const App: React.FC = () => {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);

  const notSignedRouter: RouteObject[] = [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/home',
      element: <Navigate to="/login" replace />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ];

  const signedRouter: RouteObject[] = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: BrowserRoutes
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ];

  const getBrowserRouter = () => {
    if (signed) {
      return createBrowserRouter(signedRouter);
    }
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
