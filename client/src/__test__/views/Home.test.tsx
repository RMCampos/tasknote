import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { SummaryResponse } from '../../types/SummaryResponse';
import api from '../../api-service/api';
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

describe('Renders the home view', () => {
  it('should render text based on new contentHeader component', async () => {
    const mockData: SummaryResponse = {
      pendingTaskCount: 354,
      doneTaskCount: 555,
      notesCount: 2222
    };
    const mockedGetJSON = vi.spyOn(api, 'getJSON').mockResolvedValue(mockData);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextMock}>
            <Home />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Hello,')).toBeDefined();
    expect(screen.getByText('Ricardo')).toBeDefined();
    expect(screen.getByText('Welcome to TaskNote! Get ready to complete your pending tasks')).toBeDefined();
    expect(screen.getByText('Start Your Day, Be')).toBeDefined();
    expect(screen.getByText('Productive')).toBeDefined();
  });
});
