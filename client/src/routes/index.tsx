import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import getStoredPath from '../utils/PathUtils';
import Home from '../views/Home';
import About from '../views/About';
import NotFound from '../views/NotFound';

const browserRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Navigate to={getStoredPath()} replace />
    )
  },
  {
    path: '/login',
    element: (
      <Navigate to="/home" replace />
    )
  },
  {
    path: '/home',
    element: (
      <Home />
    )
  },
  {
    path: '/about',
    element: (
      <About />
    )
  },
  {
    path: '/404',
    element: (
      <NotFound />
    )
  }
];

export default browserRoutes;
