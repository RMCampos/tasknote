import React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import './style.css';

/**
 *
 */
function Home(): JSX.Element {
  return (
    <Container>
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Search</Card.Title>
              <Card.Text>
                10
              </Card.Text>
            </Card.Body>
            <Card.Footer>3 record(s) found!</Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Card.Header>Tasks</Card.Header>
            <Card.Body>
              <Card.Title>Pending tasks</Card.Title>
              <Card.Text>
                10
              </Card.Text>
              <Button variant="primary" type="button">Go to Tasks</Button>
            </Card.Body>
            <Card.Footer>Test?</Card.Footer>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Card.Header>Notes</Card.Header>
            <Card.Body>
              <Card.Title>Notes summary</Card.Title>
              <Card.Text>
                10
              </Card.Text>
              <Button variant="primary" type="button">Go to Notes</Button>
            </Card.Body>
            <Card.Footer>Test?</Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
