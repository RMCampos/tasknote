import React from 'react';
import {
  Card, Col, Container, Row
} from 'react-bootstrap';

/**
 * About page component.
 *
 * This component displays information about the application,
 * the technology used, and the developer.
 *
 * @returns {JSX.Element} The About page component.
 */
function About(): JSX.Element {
  return (
    <Container className="about-page my-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">About TaskNote</h2>
            <p>
              TaskNote is your go-to application for managing tasks and notes in one convenient
              place. Whether you&apos;re keeping track of daily to-dos or organizing notes from
              important meetings, TaskNote helps you stay organized and productive.
            </p>
            <h4 className="mt-4">Features</h4>
            <ul>
              <li>Quickly add and manage tasks and notes</li>
              <li>Search and filter notes for easy access</li>
              <li>Intuitive and clean user interface</li>
            </ul>
            <h4 className="mt-4">Help & How to Use</h4>
            <p>
              To get started, simply sign up or log in, and you&apos;ll have access to your
              personalized dashboard. From there, you can create, edit, and delete tasks and notes,
              and organize them however you like. Need assistance? Visit our Help page (in the
              future) for tutorials and FAQs.
            </p>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">About the Technology</h2>
            <p>
              TaskNote is built using modern web technologies that ensure speed, reliability, and
              security.
            </p>
            <ul>
              <li>React with TypeScript for front-end development</li>
              <li>Bootstrap 5 for responsive design and components</li>
              <li>Spring Boot for backend services</li>
              <li>PostgreSQL for database management</li>
              <li>Docker for containerization and deployment</li>
              <li>GitHub Actions for CI/CD, testing and linting enforcement</li>
              <li>SonarCloud, and GitHub QL for security and improvements checks</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">About the Developer</h2>
            <p>
              Hi! I&apos;m Ricardo, the developer of TaskNote. I&apos;m
              passionate about building applications that make life easier
              and more organized. You can reach out to me at
              <a href="mailto:ricardompcampos@gmail.com" className="text-decoration-none">
                ricardompcampos@gmail.com
              </a>
              {' '}
              for any questions or feedback.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
