import React from 'react';
import { test, vi } from 'vitest';
import App from '../App';
import { act, render } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import authContextMock from './__mocks__/authContextMock';
import SidebarContext from '../context/SidebarContext';

const sidebarContextMock = {
  currentPage: '/home',
  setNewPage: vi.fn()
};

vi.mock('react-charts', () => ({
  Chart: ({ options }) => <div data-testid="mocked-chart">Mocked Chart</div>
}));

test('Renders the app', async () => {
  await act(async () => {
    render(
      <AuthContext.Provider value={authContextMock}>
        <SidebarContext.Provider value={sidebarContextMock}>
          <App />
        </SidebarContext.Provider>
      </AuthContext.Provider>
    );
  });
});
