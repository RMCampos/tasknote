import React, { act } from 'react';
import { test, vi } from 'vitest';
import App from '../App';
import { render } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import authContextMock from './__mocks__/authContextMock';
import SidebarContext from '../context/SidebarContext';
import FilterContext from '../context/FilterContext';

const sidebarContextMock = {
  currentPage: '/home',
  setNewPage: vi.fn()
};

const filterContextMock = {
  filterText: '',
  selectedOption: 'everything',
  setFilterText: vi.fn(),
  setSelectedOption: vi.fn()
};

vi.mock('react-charts', () => ({
  Chart: ({ options }) => <div data-testid="mocked-chart">Mocked Chart</div>
}));

test('Renders the app', async () => {
  await act(async () => {
    render(
      <AuthContext.Provider value={authContextMock}>
        <SidebarContext.Provider value={sidebarContextMock}>
          <FilterContext.Provider value={filterContextMock}>
            <App />
          </FilterContext.Provider>
        </SidebarContext.Provider>
      </AuthContext.Provider>
    );
  });
});
