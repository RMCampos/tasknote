import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import Logo from '../../assets/logo2-450-450.png';
import { useTranslation } from 'react-i18next';

/**
 * Header component.
 *
 * This component provides the header section of the application,
 * providing navigation to home, tasks, notes, and about.
 *
 * @returns {JSX.Element} The Header component.
 */
function Header(): JSX.Element {
  const { t } = useTranslation();

  return (
    <header>
      <Navbar expand="lg" className="bg-body-secondary">
        <Container>
          <LinkContainer to="/home">
            <Navbar.Brand>
              <img width="30" src={Logo} alt="TaskNote logo" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/home">
                <Nav.Link>{t('home_nav_home')}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/tasks">
                <Nav.Link>{t('home_nav_tasks')}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/notes">
                <Nav.Link>{t('home_nav_notes')}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>{t('home_nav_about')}</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
