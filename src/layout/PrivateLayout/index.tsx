import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';
import Footer from '../../components/Footer';

function Layout () {
  return (
    <>
      <Header />
      
      <Container>
        <Outlet />
      </Container>

      <Footer />
    </>
  )
}

export default Layout;
