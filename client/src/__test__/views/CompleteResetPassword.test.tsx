import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi, Mock } from 'vitest';
import { useNavigate } from 'react-router';
import AuthContext from '../../context/AuthContext';
import CompleteResetPassword from '../../views/CompleteResetPassword';

// Mock useNavigate
vi.mock('react-router', () => ({
  useNavigate: vi.fn()
}));

// Mock LoginForm
vi.mock('../../components/LoginForm', () => ({
  __esModule: true,
  default: ({ prefix }: { prefix: string }) => (
    <div data-testid="login-form">LoginForm with prefix: {prefix}</div>
  )
}));

vi.mock('react-router', () => {
  return {
    useNavigate: vi.fn(),
  };
});

const mockedUseNavigate = useNavigate as unknown as Mock;

const authContextMock = {
  signed: true,
  user: {
    userId: 1,
    name: 'Ricardo',
    email: 'test@example.com',
    admin: false,
    createdAt: new Date(),
    gravatarImageUrl: 'http://image.com'
  },
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false,
  updateUser: vi.fn()
};

describe('CompleteResetPassword Component', () => {
  const mockCheckCurrentAuthUser = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseNavigate.mockReturnValue(mockNavigate);
  });

  test('calls checkCurrentAuthUser with the correct pathname', () => {
    render(
      <AuthContext.Provider
        value={{
          ...authContextMock,
          signed: false,
          checkCurrentAuthUser: mockCheckCurrentAuthUser,
        }}
      >
        <CompleteResetPassword />
      </AuthContext.Provider>
    );

    expect(mockCheckCurrentAuthUser).toHaveBeenCalledWith(window.location.pathname);
  });

  test('navigates to /home when signed is true', () => {
    render(
      <AuthContext.Provider
        value={{
          ...authContextMock,
          signed: true,
          checkCurrentAuthUser: mockCheckCurrentAuthUser,
        }}
      >
        <CompleteResetPassword />
      </AuthContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('renders LoginForm with the correct prefix', () => {
    render(
      <AuthContext.Provider
        value={{
          ...authContextMock,
          signed: false,
          checkCurrentAuthUser: mockCheckCurrentAuthUser,
        }}
      >
        <CompleteResetPassword />
      </AuthContext.Provider>
    );

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm.innerHTML.includes('LoginForm with prefix: complete_reset')).toBe(true);
  });
});