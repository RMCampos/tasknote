import React from 'react';
import style from './Footer.module.css';
import { env } from '../env';

const Footer = () => {
  const build = env.BUILD;

  return (
    <footer className={style.footer}>
      <p>
        <span>React + TS Todo</span>
        {' '}
        @ 2022
        {` Build: ${build}`}
      </p>
    </footer>
  );
};

export default Footer;
