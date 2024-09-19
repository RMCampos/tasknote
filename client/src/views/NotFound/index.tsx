import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

/**
 * Not Found page component.
 *
 * This component displays the not found page of the application,
 * providing navigation to back to home.
 *
 * @returns The NotFound page component.
 */
function NotFound(): JSX.Element {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Page not found :/</h2>

              <div className="text-center mt-3">
                <a href="/" className="text-decoration-none">
                  Back to home
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
