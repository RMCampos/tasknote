import React from 'react';
import style from './Footer.module.css';

const Footer = () => (
  <footer className={style.footer}>
    <p>
      <span>React + TS Todo</span>
      {' '}
      @ 2022
    </p>
  </footer>
);

export default Footer;
