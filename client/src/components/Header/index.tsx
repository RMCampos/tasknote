import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import Logo from '../../assets/logo2-450-450.png';

/**
 *
 */
function Header() {
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
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/tasks">
                <Nav.Link>Tasks</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/notes">
                <Nav.Link>Notes</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
