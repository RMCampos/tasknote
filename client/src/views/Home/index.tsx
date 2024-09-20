import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import './style.css';
import { getHomeSummary } from '../../api-service/homeService';
import { SummaryResponse } from '../../types/SummaryResponse';

/**
 *
 */
function Home(): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [summary, setSummary] = useState<SummaryResponse | undefined>();
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);

  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(e);
    } else if (e instanceof Error) {
      setErrorMessage(e.message);
    }
  }

  const getSummary = async () => {
    const response = await getHomeSummary();
    if (response instanceof Error) {
      handleError(response);
    } else {
      setSummary(response);
    }
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      return;
    }

    setFormInvalid(false);
    console.log("search for", form.search_term.value);
    //const added: boolean = await addTask(form.description.value, form.url.value);
    //if (added) {
    //  form.reset();
    //}
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <Container>
      <Row className="mt-3">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Search task or note</Card.Title>

              <Form noValidate validated={validated} onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                  <Form.Control
                    pattern=".{3,}"
                    required
                    type="text"
                    id="search_term"
                    name="search_term"
                    placeholder="Search term"
                  />
                  <Button type="submit" variant="outline-secondary" id="button-search">
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Card.Body>
            <Card.Footer>3 record(s) found!</Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} sm={6}>
          <Card className="text-center">
            <Card.Header>Tasks summary</Card.Header>
            <Card.Body>
              <Card.Title>
                {summary?.pendingTaskCount && summary?.pendingTaskCount > 0?
                  `${summary?.pendingTaskCount}` : 'Zero!'}
              </Card.Title>
              <Card.Text>
                {summary?.pendingTaskCount && summary?.pendingTaskCount > 0?
                  `❗ ${summary?.pendingTaskCount} Pending Tasks` : 'No pending tasks!'}
              </Card.Text>
              <Button variant="primary" type="button">Go to Tasks</Button>
            </Card.Body>
            <Card.Footer>
              {summary?.doneTaskCount && summary?.doneTaskCount > 0?
                'All tasks finished! Well done!' : '🤔 No tasks done yet!?'}
            </Card.Footer>
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
