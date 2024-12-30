import React, { useContext } from 'react';
import {
  Button, Col, Container, Row
} from 'react-bootstrap';
import { Link } from 'react-router';
import AuthContext from '../../context/AuthContext';
import './style.css';
import { useTranslation } from 'react-i18next';

/**
 * Footer component.
 *
 * This component provides the footer section of the application,
 * including logout functionality and version information.
 *
 * @returns {JSX.Element} The Footer component.
 */
function Footer(): JSX.Element {
  const { signOut, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const build = import.meta.env.VITE_BUILD;
  const currentYear = new Date().getFullYear();

  const goOut = () => {
    signOut();
    // navigate('/');
  };

  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} sm={4} className="text-center text-md-start">
            <span data-testid="footer-text">
              TaskNote App &copy;
              {' '}
              {currentYear}
              {' '}
              (Build
              {' '}
              {build}
              )
            </span>
          </Col>

          <Col xs={12} sm={4} className="text-center my-2 my-md-0">
            <Link to="/account" data-testid="footer-user-text">
              {t('footer_my_account')}
              (
              {user?.email}
              )
            </Link>
          </Col>

          <Col xs={12} sm={4} className="text-center text-md-end">
            <Button
              type="button"
              variant="link"
              onClick={() => goOut()}
              className="logout-button"
            >
              {t('logout')}
            </Button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
