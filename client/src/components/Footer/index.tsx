import React, { useContext } from 'react';
import {
  Button, Col, Container, Row
} from 'react-bootstrap';
import { env } from '../../env';
import AuthContext from '../../context/AuthContext';
import './style.css';
import { useNavigate } from 'react-router-dom';

/**
 * Footer component.
 *
 * This component provides the footer section of the application,
 * providing navigation to logout.
 * It also includes the build version.
 *
 * @returns {JSX.Element} The Footer component.
 */
function Footer(): JSX.Element {
  const { signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const build = env.VITE_BUILD;
  const currentYear = new Date().getFullYear();

  const goOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} sm={4} className="text-center text-sm-start">
            <span data-testid="footer-text">
              TaskNote App &copy;
              {currentYear}
              {' '}
              (
              {build}
              )
            </span>
          </Col>
          <Col xs={12} sm={4} className="text-center text-sm-end">
            {user?.email}
          </Col>
          <Col xs={12} sm={4} className="text-center text-sm-end">
            <Button type="button" variant="link" onClick={() => goOut()} className="logout-button">
              Logout
            </Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
