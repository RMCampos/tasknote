import React, { useContext, useEffect, useState } from 'react';

// Components
import Footer from './components/Footer';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Modal from './components/Modal';

// Styles
import './styles/custom.scss';

// Interfaces
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './views/Landing';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './layout/PrivateLayout';
import browserRoutes from './routes';
import NotFound from './views/NotFound';
import AuthContext from './context/AuthContext';

const App: React.FC = () => {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);

  const notSignedRouter = createBrowserRouter([
    {
      path: '*',
      element: <Landing />
    }
  ]);

  const signedRouter = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: browserRoutes
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  const getBrowserRoutes = () => {
    if (signed) {
      return signedRouter;
    }
    return notSignedRouter;
  }

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
  }, []);

  return (
    <RouterProvider router={getBrowserRoutes()} />
  );
};

export default App;
