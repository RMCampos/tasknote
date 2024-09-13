import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Button, Form } from 'react-bootstrap';
import { FeedbackType } from 'react-bootstrap/esm/Feedback';

function Login() {
  const { signIn } = useContext(AuthContext);
  const [validated, setValidated] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailValidType, setEmailValidType] = useState<FeedbackType | undefined>('valid');
  const [emailValidMsg, setEmailValidMsg] = useState<string>('Looks good!');
  const [passwordValidType, setPasswordValidType] = useState<FeedbackType | undefined>('valid');
  const [passwordValidMsg, setPasswordValidMsg] = useState<string>('Looks good!');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log('form is invalid!');

      if (email.length === 0) {
        setEmailValidType('invalid');
        setEmailValidMsg('Please type your email!');
      } else {
        setEmailValidType('valid');
        setEmailValidMsg('Looks good!');
      }
      
      if (password.length === 0) {
        setPasswordValidType('invalid');
        setPasswordValidMsg('Please type your password!');
      } else {
        setPasswordValidType('valid');
        setPasswordValidMsg('Looks good!');
      }

      return;
    }

    setEmailValidType('valid');
    setEmailValidMsg('Looks good!');
    
    setPasswordValidType('valid');
    setPasswordValidMsg('Looks good!');
    console.log('form is valid!');
    console.log(`email=${email}, password=${password}`);
  };

  const resetForm = () => {
    setValidated(false);
    setEmail('');
    setEmailValidType('valid');
    setPassword('');
    setPasswordValidType('valid');
  };

  useEffect(() => {}, [validated]);

  return (
    <>
      <h1>This is login page</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={emailValidType === 'invalid'}
          />
          <Form.Control.Feedback type={emailValidType}>
            {emailValidMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={passwordValidType === 'invalid'}
          />
          <Form.Control.Feedback type={passwordValidType}>
            {passwordValidMsg}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
        <Button variant="secondary" type="button" onClick={() => resetForm()}>
          Reset
        </Button>
      </Form>
    </>
  );
}

export default Login;
