import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router';
import Logo from '../../assets/logo2-450-450.png';
import { useTranslation } from 'react-i18next';

/**
 * Header component.
 *
 * This component provides the header section of the application,
 * providing navigation to home, tasks, notes, and about.
 *
 * @returns {React.ReactNode} The Header component.
 */
function Header(): React.ReactNode {
  const { t } = useTranslation();

  return (
    <header>
      <Navbar expand="lg" className="bg-body-secondary">
        <Container>
          <NavLink to="/home">
            <Navbar.Brand>
              <img width="30" src={Logo} alt="TaskNote logo" />
            </Navbar.Brand>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/home">
                <Nav.Link as="span">{t('home_nav_home')}</Nav.Link>
              </NavLink>

              <NavLink to="/tasks">
                <Nav.Link as="span">{t('home_nav_tasks')}</Nav.Link>
              </NavLink>
              <NavLink to="/notes">
                <Nav.Link as="span">{t('home_nav_notes')}</Nav.Link>
              </NavLink>
              <NavLink to="/about">
                <Nav.Link as="span">{t('home_nav_about')}</Nav.Link>
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
