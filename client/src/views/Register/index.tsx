import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Created the Login component.
 */
function Login() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState<boolean>(true);
  const [formInvalid, setFormInvalid] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormInvalid(true);
      return;
    }

    setFormInvalid(false);
    await signIn(form.email.value, form.password.value);
    goTo("/home");
  };

  const goTo = useCallback((page: string) => {
    navigate(page);
  }, []);

  useEffect(() => {}, [formInvalid]);

  return (
    <>
      <h1>This is register page</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Col} md="4" className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            name="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group as={Col} md="4" className="mb-3" controlId="formBasicPassword">
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
        >
          Register
        </Button>
      </Form>

      <Button
        variant="seconday"
        type="button"
        onClick={() => goTo("/login")}
      >
        Go to login instead
      </Button>

      <Button
        variant="seconday"
        type="button"
        onClick={() => goTo("/")}
      >
        Back to home
      </Button>

      {formInvalid ? (
        <Alert variant={"danger"}>
          Something is wrong! Check your email and password!
        </Alert>
      ) : null}
    </>
  );
}

export default Login;
