import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import './styles.scss';
import AuthContext from '../../context/AuthContext';

function Landing() {
  const { signIn } = useContext(AuthContext);

  return (
    <>
      <h1>This is landing page</h1>
      <Button
        type="button"
        onClick={() => signIn()}
      >
        Login
      </Button>
    </>
  )
}

export default Landing;
