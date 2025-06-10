// filepath: /home/ricardo/Projects/react-typescript-todolist/client/src/__test__/views/EmailConfirmation.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import api from '../../api-service/api';
import EmailConfirmation from '../../views/EmailConfirmation';
import { MemoryRouter } from 'react-router';
import ApiConfig from '../../api-service/apiConfig';

// Mock the entire api module
vi.mock('../../api-service/api', () => ({
  default: {
    postJSON: vi.fn()
  }
}));

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'email_confirmation_loading': 'Confirming your email address...',
        'email_confirmation_success': '✅ Email Confirmed!',
        'email_confirmation_success_text': 'Your email has been successfully confirmed.',
        'email_confirmation_btn': 'Login'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  })
}));

// Mock the lang handler
vi.mock('../../lang-service/LangHandler', () => ({
  handleDefaultLang: vi.fn()
}));

// Mock the translator utils
vi.mock('../../utils/TranslatorUtils', () => ({
  translateServerResponse: (message: string) => message
}));

const mockedApi = vi.mocked(api);

describe('EmailConfirmation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  const renderWithRouter = (initialEntries: string[] = ['/?identification=test-id']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <EmailConfirmation />
      </MemoryRouter>
    );
  }

  test('renders loading state initially', () => {
    window.history.pushState({}, '', '/?identification=test-id'); // Default query param
    // Mock a pending promise to keep loading state
    mockedApi.postJSON.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(['/?identification=test-id']);
    expect(screen.getByText('Confirming your email address...')).toBeDefined();
  });

  test('shows error when identification is missing', async () => {
    window.history.pushState({}, '', '/'); // No query param
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByTestId('email-confirm-error-msg')).toBeDefined();
    });
  });

  test('shows success message when API call succeeds', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    vi.spyOn(api, 'postJSON').mockResolvedValue({});
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      expect(screen.getByTestId('email-confirm-success-msg')).toBeDefined();
    });
  });

  test('shows error message when API call fails', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockRejectedValue(new Error('API error occurred')); // Mock API failure
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByText('API error occurred')).toBeDefined();
    });
  });

  test('does not call API if identification is missing', async () => {
    window.history.pushState({}, '', '/'); // No query param
    renderWithRouter();

    await waitFor(() => {
      expect(mockedApi.postJSON).not.toHaveBeenCalled();
    });
  });

  test('calls API with correct payload when identification is present', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      expect(mockedApi.postJSON).toHaveBeenCalledWith(ApiConfig.confirmUrl, { identification: 'test-id' });
    });
  });

  test('renders correct styles for success state', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      const successMessage = screen.getByTestId('email-confirm-success-msg');
      expect(successMessage).toBeDefined();
      expect(successMessage.classList.contains('mb-4')).toBe(true);
    });
  });

  test('renders correct styles for error state', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockRejectedValueOnce(new Error('API error occurred'));
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      const errorMessage = screen.getByText('❌ Oops!');
      expect(errorMessage).toBeDefined();
      expect(errorMessage.classList.contains('mb-3')).toBe(true);
    });
  });

  test('renders "Go to Login" button on success', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockResolvedValueOnce({}); // Mock successful API response
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      const loginButton = screen.getByText('Login');
      expect(loginButton).toBeDefined();
      expect(loginButton.classList.contains('btn-success')).toBe(true);
    });
  });

  test('does not render "Go to Login" button on error', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      const loginButton = screen.queryByText('Go to Login');
      expect(loginButton).toBeNull();
    });
  });

  test('shows error message when API call fails', async () => {
    window.history.pushState({}, '', '/?identification=test-id');
    mockedApi.postJSON.mockRejectedValueOnce(new Error('API error occurred')); // Mock API failure
    renderWithRouter(['/?identification=test-id']);

    await waitFor(() => {
      expect(screen.getByText('❌ Oops!')).toBeDefined();
      expect(screen.getByText('API error occurred')).toBeDefined();
    });
  });
});