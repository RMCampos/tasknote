import React from 'react';
// import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import Home from '../../views/Home';
import '../../i18n';
import AuthContext from '../../context/AuthContext';

// Mock the Chart component
vi.mock('react-charts', () => ({
  Chart: ({ options }) => <div data-testid="mocked-chart">Mocked Chart</div>
}));

vi.mock('../../api-service/api');

const authContextMock = {
  signed: true,
  user: {
    userId: 1,
    name: 'Ricardo',
    email: 'ricardo@campos.com',
    admin: false,
    createdAt: new Date()
  },
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false,
  updateUser: vi.fn(),
};

describe('Renders the home view', () => {
  it('should render text based on new contentHeader component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthContext.Provider value={authContextMock}>
          <Home />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(getByText('Hello,')).toBeDefined();
    expect(getByText('Ricardo')).toBeDefined();
    expect(getByText('Welcome to TaskNote! Get ready to complete your pending tasks')).toBeDefined();
    expect(getByText('Start Your Day, Be')).toBeDefined();
    expect(getByText('Productive')).toBeDefined();
  });
});
