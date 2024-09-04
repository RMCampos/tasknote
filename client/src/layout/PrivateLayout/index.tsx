import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

/**
 *
 */
function Layout() {
  return (
    <>
      <Header />

      <Container>
        <Outlet />
      </Container>

      <Footer />
    </>
  );
}

export default Layout;
