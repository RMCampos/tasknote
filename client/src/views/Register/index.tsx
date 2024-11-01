import React from 'react';
import LoginForm from '../../components/LoginForm';

/**
 * Register page component.
 *
 * This component displays the register page of the application,
 * providing navigation to login or back to home.
 *
 * @returns {JSX.Element} The Register page component.
 */
function Register(): JSX.Element {
  return <LoginForm prefix="register" />;
}

export default Register;
