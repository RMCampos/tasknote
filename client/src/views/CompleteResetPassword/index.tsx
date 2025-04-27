import React, { useContext, useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router';

/**
 * Login page component.
 *
 * This component displays the login page of the application,
 * providing navigation to register or back to home.
 *
 * @returns {React.ReactNode} The Login page component.
 */
function CompleteResetPassword(): React.ReactNode {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
    if (signed) {
      navigate('/home');
    }
  }, [signed]);

  return <LoginForm prefix="complete_reset" />;
}

export default CompleteResetPassword;
