import React, { useCallback, useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * Landing page component.
 *
 * This component displays the landing page of the application,
 * providing navigation to login or register.
 * It also checks for an existing user session.
 *
 * @returns The Landing page component.
 */
function Landing(): JSX.Element {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handles the login button click event.
   *
   * If a user is already signed in, it navigates to the home page.
   * Otherwise, it navigates to the login page.
   */
  const handleLogin = (): void => {
    if (signed) {
      goTo('/home');
    } else {
      goTo('/login');
    }
  };

  /**
   * Navigates to the specified page.
   *
   * @param {string} page - The page to navigate to.
   */
  const goTo = useCallback((page: string): void => {
    navigate(page);
  }, []);

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
  }, []);

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="display-4 fw-bold">Welcome to TaskNote App</h1>
        <p className="lead mb-4">
          Your best friend to keep up with notes and tasks!
        </p>

        <Button
          type="button"
          variant="primary"
          className="btn-lg me-3"
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          variant="outline-primary"
          className="btn-lg"
          type="button"
          onClick={() => goTo("/register")}
        >
          Register
        </Button>
      </div>
    </Container>
      
  );
}

export default Landing;
