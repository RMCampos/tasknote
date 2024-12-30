import React from 'react';
import { Navigate, RouteObject } from 'react-router';
import getStoredPath from '../utils/PathUtils';
import Home from '../views/Home';
import About from '../views/About';
import Task from '../views/Task';
import Note from '../views/Note';
import Account from '../views/Account';

const BrowserRoutes: RouteObject[] = [
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
    path: '/register',
    element: (
      <Navigate to="/home" replace />
    )
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/tasks',
    element: <Task />
  },
  {
    path: '/notes',
    element: <Note />
  },
  {
    path: '/account',
    element: <Account />
  }
];

export default BrowserRoutes;
