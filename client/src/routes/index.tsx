import { Navigate, RouteObject } from 'react-router-dom';
import getStoredPath from '../utils/PathUtils';
import Home from '../views/Home';
import About from '../views/About';

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
    element: (
      <Home />
    )
  },
  {
    path: '/about',
    element: (
      <About />
    )
  }
];

export default BrowserRoutes;
