import React from 'react';
import { Button } from 'react-bootstrap';
import './styles.scss';
import { useNavigate } from 'react-router-dom';

/**
 *
 */
function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <h1>This is landing page</h1>
      <Button
        type="button"
        onClick={() => navigate('/signin')}
      >
        SignIn
      </Button>
    </>
  );
}

export default Landing;
