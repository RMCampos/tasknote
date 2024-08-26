import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import style from './Footer.module.css';
import { env } from '../env';
import AuthContext from '../context/AuthContext';

const Footer = () => {
  const { signOut } = useContext(AuthContext);
  const build = env.VITE_BUILD;

  return (
    <footer className={style.footer}>

      <span>React + TS Todoo</span>
      {' '}
      @ 2024
      {` Build: ${build}`}

      <Button
        type="button"
        onClick={() => signOut()}
      >
        Sair
      </Button>
    </footer>
  );
};

export default Footer;
