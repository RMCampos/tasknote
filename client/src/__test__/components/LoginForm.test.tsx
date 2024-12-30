import React from 'react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import LoginForm from '../../components/LoginForm';
import '../../i18n';

describe('LoginForm Component test', () => {
  it('should render the Login Form component correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm prefix="login" />
      </BrowserRouter>
    );

    const loginEmailInput: HTMLInputElement = screen.getByTestId('login_email_input');
    expect(loginEmailInput).toBeDefined();
    expect(loginEmailInput.required).toBe(true);
  });

  it('should render the Register Form component correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm prefix="register" />
      </BrowserRouter>
    );

    const loginEmailInput: HTMLInputElement = screen.getByTestId('register_email_input');
    expect(loginEmailInput).toBeDefined();
    expect(loginEmailInput.required).toBe(true);
  });
});
