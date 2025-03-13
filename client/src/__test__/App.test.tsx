import React from 'react';
import { test, vi } from 'vitest';
import App from '../App';
import { render } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import authContextMock from './__mocks__/authContextMock';
import SidebarContext from '../context/SidebarContext';

const sidebarContextMock = {
  currentPage: '/home',
  setNewPage: vi.fn()
};

test('Renders the app', () => {
  render(
    <AuthContext.Provider value={authContextMock}>
      <SidebarContext.Provider value={sidebarContextMock}>
        <App />
      </SidebarContext.Provider>
    </AuthContext.Provider>
  );
});
