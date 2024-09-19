import { Navigate, RouteObject } from 'react-router-dom';
import getStoredPath from '../utils/PathUtils';
import Home from '../views/Home';
import About from '../views/About';
import Task from '../views/Task';
import Note from '../views/Note';

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
      <Navigate to={"/home"} replace />
    )
  },
  {
    path: '/register',
    element: (
      <Navigate to={"/home"} replace />
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
  }
];

export default BrowserRoutes;
