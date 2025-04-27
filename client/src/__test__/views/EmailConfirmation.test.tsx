// filepath: /home/ricardo/Projects/react-typescript-todolist/client/src/__test__/views/EmailConfirmation.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import api from '../../api-service/api';
import EmailConfirmation from '../../views/EmailConfirmation';
import { MemoryRouter } from 'react-router';
import ApiConfig from '../../api-service/apiConfig';

// Mock api.postJSON
vi.mock('../../api-service/api');

const mockedPostJSON = vi.mocked(api.postJSON);

describe('EmailConfirmation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/?identification=test-id'); // Default query param
  });

  const renderFn = () => {
    return render(
      <MemoryRouter>
        <EmailConfirmation />
      </MemoryRouter>
    );
  }

  test('renders loading state initially', () => {
    render(<EmailConfirmation />);
    expect(screen.getByText('Confirming your email address...')).toBeDefined();
  });

  test('shows error when identification is missing', async () => {
    window.history.pushState({}, '', '/'); // No query param
    render(<EmailConfirmation />);

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByText('Wrong or missing identification.')).toBeDefined();
    });
  });

  test('shows success message when API call succeeds', async () => {
    vi.spyOn(api, 'postJSON').mockResolvedValue({});
    renderFn();

    await waitFor(() => {
      expect(screen.getByText('✅ Email Confirmed')).toBeDefined();
    });
  });

  test('shows error message when API call fails', async () => {
    mockedPostJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderFn();

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByText('API error occurred')).toBeDefined();
    });
  });

  test('does not call API if identification is missing', async () => {
    window.history.pushState({}, '', '/'); // No query param
    renderFn();

    await waitFor(() => {
      expect(mockedPostJSON).not.toHaveBeenCalled();
    });
  });

  test('calls API with correct payload when identification is present', async () => {
    mockedPostJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderFn();

    await waitFor(() => {
      expect(mockedPostJSON).toHaveBeenCalledWith(ApiConfig.confirmUrl, { identification: 'test-id' });
    });
  });

  test('renders correct styles for success state', async () => {
    mockedPostJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderFn();

    await waitFor(() => {
      const successMessage = screen.getByText('✅ Email Confirmed');
      expect(successMessage).toBeDefined();
      expect(successMessage.classList.contains('mb-3')).toBe(true);
    });
  });

  test('renders correct styles for error state', async () => {
    mockedPostJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderFn();

    await waitFor(() => {
      const errorMessage = screen.getByText('❌ Oops!');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.classList.contains('mb-3')).toBe(true);
    });
  });

  test('renders "Go to Login" button on success', async () => {
    mockedPostJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderFn();

    await waitFor(() => {
      const loginButton = screen.getByText('Go to Login');
      expect(loginButton).toBeDefined();
      expect(loginButton.classList.contains('btn-success')).toBe(true);
    });
  });

  test('does not render "Go to Login" button on error', async () => {
    mockedPostJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderFn();

    await waitFor(() => {
      const loginButton = screen.queryByText('Go to Login');
      expect(loginButton).toBeNull();
    });
  });

  test('shows error message when API call fails', async () => {
    mockedPostJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderFn();

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByText('API error occurred')).toBeDefined();
    });
  });
});