import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import authContextMock from '../__mocks__/authContextMock';
import Footer from '../../components/Footer';
import AuthContext from '../../context/AuthContext';

describe('Footer component test', () => {
  beforeAll(() => {
    //import.meta.env.VITE_BUILD = ;
    vi.stubEnv('VITE_BUILD', 'test-build');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('should renders the footer with current year and build version', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextMock}>
          <Footer />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const currentYear = new Date().getFullYear();

    const footerText = screen.getByTestId('footer-text');
    expect(footerText).toBeDefined();
    expect(footerText.innerHTML).toBe(`TaskNote App ©${currentYear} (test-build)`);
  });

  it('should renders the user email when logged in', () => {
    const contextMockWithEmail = {
      ...authContextMock,
      user: {
        email: 'test@example.com',
      }
    };

    const { getByText } = render(
      <BrowserRouter>
        <AuthContext.Provider value={contextMockWithEmail}>
          <Footer />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(getByText(contextMockWithEmail.user.email)).toBeDefined();
  });

  it('calls signOut function when logout button is clicked', () => {
    const signOutMock = vi.fn();
    const contextMockWithEmail = {
      ...authContextMock,
      signOut: signOutMock
    };

    const { getByText } = render(
      <BrowserRouter>
        <AuthContext.Provider value={contextMockWithEmail}>
          <Footer />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    const logoutButton = getByText('Logout');

    act(() => {
      logoutButton.click();
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });
});
