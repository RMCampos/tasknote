import React from 'react';
import { Navigate, RouteObject } from 'react-router';
import getStoredPath from '../utils/PathUtils';
import Home from '../views/Home';
import About from '../views/About';
import TaskAdd from '../views/TaskAdd';
import Account from '../views/Account';
import NoteAdd from '../views/NoteAdd';

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
    path: '/tasks/new',
    element: <TaskAdd />
  },
  {
    path: '/tasks/edit/:id',
    element: <TaskAdd />
  },
  {
    path: '/notes/new',
    element: <NoteAdd />
  },
  {
    path: '/notes/edit/:id',
    element: <NoteAdd />
  },
  {
    path: '/account',
    element: <Account />
  }
];

export default BrowserRoutes;
