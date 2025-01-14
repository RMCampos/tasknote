import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import AuthContext from '../../context/AuthContext';

/**
 * A component that protects routes from being accessed by unauthenticated users.
 *
 * If the user is not signed in, they are redirected to the home page and signed out.
 * If the user is signed in, the child routes are rendered.
 *
 * @component
 * @returns {React.ReactNode} The rendered component.
 */
function ProtectedRoute(): React.ReactNode {
  const { signed, signOut } = useContext(AuthContext);

  if (!signed) {
    signOut();
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
