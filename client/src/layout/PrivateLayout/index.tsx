import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.css';

/**
 * Layout component.
 *
 * This component provides the layout of the application,
 * including the outlet responsible for the main content.
 * It also includes the header and the footer.
 *
 * @returns {JSX.Element} The Layout component.
 */
function Layout(): JSX.Element {
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

export default Layout;
