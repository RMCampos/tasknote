// AuthProvider.test.tsx
import React, { useContext } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarProvider from '../../context/SidebarProvider';
import SidebarContext, { SidebarContextData } from '../../context/SidebarContext';

// Create a helper component to consume AuthContext for testing.
const ConsumerComponent: React.FC = () => {
  const {
    currentPage,
    setNewPage
  } = useContext<SidebarContextData>(SidebarContext);

  return (
    <div>
      <div data-testid="page">{currentPage}</div>
      <button
        data-testid="setPage"
        onClick={() => {
          setNewPage('/another');
        }}
      >
        Change page
      </button>
    </div>
  );
};

describe('SidebarProvider', () => {
  // Reset DOM and mocks for each test.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the default context values', () => {
    const { getByTestId } = render(
      <SidebarProvider>
        <ConsumerComponent />
      </SidebarProvider>
    );

    expect(getByTestId('page').textContent).toBe('/home');
  });

  it('should set a new page after click', async () => {
    const { getByTestId } = render(
      <SidebarProvider>
        <ConsumerComponent />
      </SidebarProvider>
    );

    await act(async () => {
      userEvent.click(getByTestId('setPage'));
    });

    await waitFor(() =>
      expect(getByTestId('page').textContent).toBe('/another')
    );
  });
});
