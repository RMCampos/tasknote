import React, { useCallback, useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 *
 */
function Landing() {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Landing handleLogin signed', signed);
    if (signed) {
      goTo('/home');
    } else {
      goTo('/login');
    }
  };

  const goTo = useCallback((page: string) => {
    navigate(page);
  }, []);

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
  }, []);

  return (
    <>
      <h1>This is landing page</h1>
      <Button
        type="button"
        variant="primary"
        onClick={handleLogin}
      >
        Login
      </Button>
      <Button
        variant="seconday"
        type="button"
        onClick={() => goTo("/register")}
      >
        Register
      </Button>
    </>
  );
}

export default Landing;
