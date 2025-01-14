import React from 'react';
import { Outlet } from 'react-router';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.css';

/**
 * PrivateLayout component.
 *
 * This component provides the layout of the application,
 * including the outlet responsible for the main content.
 * It also includes the header and the footer.
 *
 * @returns {React.ReactNode} The Layout component.
 */
function PrivateLayout(): React.ReactNode {
  return (
    <div className="page-container">
      <Header />
      <Container className="content-container">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default PrivateLayout;
