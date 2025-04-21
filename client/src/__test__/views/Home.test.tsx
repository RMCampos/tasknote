import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { SummaryResponse } from '../../types/SummaryResponse';
import api from '../../api-service/api';
import Home from '../../views/Home';
import '../../i18n';
import AuthContext from '../../context/AuthContext';
import { TasksChartResponse } from '../../types/TasksChartResponse';

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

const mockData: SummaryResponse = {
  pendingTaskCount: 354,
  doneTaskCount: 555,
  notesCount: 2222
};

const mockTags: string[] = ['tag1', 'tag2'];

const mockChart: TasksChartResponse[] = [
  { day: 'S', count: 5, date: new Date() },
  { day: 'M', count: 10, date: new Date() },
];

describe('Renders the home view', () => {
  it('should render text based on new contentHeader component', async () => {
    
    vi.spyOn(api, "getJSON").mockImplementation((url: string) => {
      if (url === 'http://localhost:8585/rest/home/tasks/tags') {
        return Promise.resolve(mockTags);
      } else if (url === 'http://localhost:8585/rest/home/summary') {
        return Promise.resolve(mockData);
      } else if (url === 'http://localhost:8585/rest/home/completed-tasks-chart') {
        return Promise.resolve(mockChart);
      }
      return Promise.reject(new Error("Unknown endpoint: " + url));
    });

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
