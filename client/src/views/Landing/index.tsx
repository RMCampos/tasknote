import React, { useContext, useEffect } from 'react';
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
    console.log('Landing signed', signed);
    if (signed) {
      navigate('/home');
    } else {
      navigate('/signin');
    }
  };

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
  }, []);

  return (
    <>
      <h1>This is landing page</h1>
      <Button
        type="button"
        onClick={handleLogin}
      >
        SignIn
      </Button>
    </>
  );
}

export default Landing;
