import React from 'react';
import './styles.scss';
import LoginForm from '../../components/LoginForm';

/**
 * Login page component.
 *
 * This component displays the login page of the application,
 * providing navigation to register or back to home.
 *
 * @returns {React.ReactNode} The Login page component.
 */
function Login(): React.ReactNode {
  return <LoginForm prefix="login" />;
}

export default Login;
