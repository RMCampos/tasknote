import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Login page component.
 *
 * This component displays the login page of the application,
 * providing navigation to register or back to home.
 *
 * @returns The Login page component.
 */
function Login(): JSX.Element {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Handles the form submit button click event.
   *
   * When clicked, checks if the form is valid. It it's not, raise an error
   * message in an Alert. Otherwise, it call the signIn API and navigates to the home page.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      return;
    }

    setFormInvalid(false);
    try {
      await signIn(form.email.value, form.password.value);
      goTo("/home");
    } catch (e) {
      setFormInvalid(true);
      if (typeof e === 'string') {
        setErrorMessage(e);
      } else if (e instanceof Error) {
        setErrorMessage(e.message);
      }
    }
  };

  /**
   * Navigates to the specified page.
   *
   * @param {string} page - The page to navigate to.
   */
  const goTo = useCallback((page: string): void => {
    navigate(page);
  }, []);

  useEffect(() => {}, [formInvalid]);

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Login</h2>

              {formInvalid ? (
                <Alert variant={"danger"}>
                  { errorMessage }
                </Alert>
              ) : null}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter email"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                >
                  Login
                </Button>
              </Form>

              <div className="text-center mt-3">
                Don't have an account?&nbsp;
                <a href="/register" className="text-decoration-none">
                  Register
                </a>
              </div>

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

export default Login;
