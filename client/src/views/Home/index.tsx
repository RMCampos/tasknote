import React, { useEffect, useState } from 'react';
import {
  Accordion,
  Alert,
  Button, Card, Col, Container, Form, InputGroup, Row
} from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { SummaryResponse } from '../../types/SummaryResponse';
import { HomeSearchResponse } from '../../types/HomeSearchResponse';
import { TaskResponse } from '../../types/TaskResponse';
import { NoteResponse } from '../../types/NoteResponse';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

/**
 *
 */
function Home(): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [summary, setSummary] = useState<SummaryResponse | undefined>();
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<HomeSearchResponse | null>(null);
  const navigate = useNavigate();

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(e);
    } else if (e instanceof Error) {
      setErrorMessage(e.message);
    }
  };

  const getSummary = async () => {
    try {
      const response = await api.getJSON(`${ApiConfig.homeUrl}/summary`);
      setSummary(response);
    } catch (e) {
      handleError(e);
    }
  };

  const searchTerm = async (term: string): Promise<boolean> => {
    try {
      const response: HomeSearchResponse = await api.getJSON(`${ApiConfig.homeUrl}/search?term=${term}`);
      setSearchResults(response);
      return true;
    } catch (e) {
      handleError(e);
    }
    return false;
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      setErrorMessage('Please type at least 3 characters');
      return;
    }

    setFormInvalid(false);
    const searched: boolean = await searchTerm(form.search_term.value);
    if (searched) {
      form.reset();
    }
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <Container>
      <h1 className="mt-5 mb-4">Welcome to Your Dashboard</h1>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card className="text-center h-100">
            <Card.Header className="bg-primary text-white">
              Tasks Summary
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <Card.Title className="display-4">
                {summary?.pendingTaskCount || '0'}
              </Card.Title>
              <Card.Text>
                {summary?.pendingTaskCount && summary?.pendingTaskCount > 0
                  ? 'Pending Tasks'
                  : 'No pending tasks!'}
              </Card.Text>
              <Button
                variant="primary"
                type="button"
                onClick={() => navigate('/tasks')}
              >
                Go to Tasks
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="text-center h-100">
            <Card.Header className="bg-success text-white">
              Notes Summary
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <Card.Title className="display-4">10</Card.Title>
              <Card.Text>Notes</Card.Text>
              <Button
                variant="success"
                type="button"
                onClick={() => navigate('/notes')}
              >
                Go to Notes
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Search Tasks and Notes</Card.Title>

              {formInvalid ? (
                <Alert variant="danger">
                  { errorMessage }
                </Alert>
              ) : null}

              <Form noValidate validated={validated} onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                  <Form.Control
                    pattern=".{3,}"
                    required
                    type="text"
                    id="search_term"
                    name="search_term"
                    placeholder="Enter your search term..."
                  />
                  <Button type="submit" variant="primary" id="button-search">
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <h2>Search Results</h2>

          <Accordion defaultActiveKey="0">
            {searchResults && searchResults.tasks.length > 0 && (
              searchResults.tasks.map((task: TaskResponse) => (
                <Accordion.Item key={task.description} eventKey={task.description}>
                  <Accordion.Header>
                    [Task]
                    {' '}
                    {task.description}
                  </Accordion.Header>
                  <Accordion.Body>
                    {task.urls.length > 0 ? (
                      <a href={`${task.urls[0].url}`}>{task.urls[0].url}</a>
                    ) : 'No URL!'}
                  </Accordion.Body>
                </Accordion.Item>
              ))
            )}
            {searchResults && searchResults.notes.length > 0 && (
              searchResults.notes.map((note: NoteResponse) => (
                <Accordion.Item key={note.title} eventKey={note.title}>
                  <Accordion.Header>
                    [Note]
                    {' '}
                    {note.title}
                  </Accordion.Header>
                  <Accordion.Body>
                    <span className="span-line-break">
                      { note.description }
                    </span>
                  </Accordion.Body>
                </Accordion.Item>
              ))
            )}
            {searchResults?.tasks.length === 0 && searchResults?.notes.length === 0 && (
              <h3>No results</h3>
            )}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
