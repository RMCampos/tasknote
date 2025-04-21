import React, { useContext, useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import AuthContext from '../../context/AuthContext';
import './styles.scss';
import { useNavigate } from 'react-router';

/**
 * Login page component.
 *
 * This component displays the login page of the application,
 * providing navigation to register or back to home.
 *
 * @returns {React.ReactNode} The Login page component.
 */
function Login(): React.ReactNode {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
    if (signed) {
      navigate('/home');
    }
  }, [signed]);

  return <LoginForm prefix="login" />;
}

export default Login;
