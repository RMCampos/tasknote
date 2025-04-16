import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import Account from '../../views/Account';
import AuthContext from '../../context/AuthContext';
import i18n from '../../i18n';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

vi.mock('../../api-service/api');

const changeLanguageMock = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: changeLanguageMock,
      language: 'en'
    },
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
  I18nextProvider: ({ children }: any) => children,
}));

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

describe('Account Component', () => {
  const renderAccount = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={authContextMock}>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('should render the Account component', () => {
    const { getByText } = renderAccount();
    expect(getByText('Update only what you need. Blank fields will not be updated')).toBeDefined();
  });

  it('should change language when a language button is clicked', () => {
    const { getByTestId } = renderAccount();
    const languageButton = getByTestId('language-button-pt_br');
    fireEvent.click(languageButton);
    expect(changeLanguageMock).toHaveBeenCalled();
  });

  it('should show alert when delete button is clicked', () => {
    const { getByText } = renderAccount();
    const deleteButton = getByText('account_privacy_delete_btn');
    fireEvent.click(deleteButton);
    expect(getByText('account_delete_title')).toBeDefined();
  })

  it('should call deleteAccount API and signOut when delete is confirmed', async () => {
    const { getByText } = renderAccount();
    const deleteButton = getByText('account_privacy_delete_btn');
    fireEvent.click(deleteButton);
    const confirmButton = getByText('account_delete_btn');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.postJSON).toHaveBeenCalledWith(ApiConfig.deleteAccountUrl, {});
      expect(authContextMock.signOut).toHaveBeenCalled();
    });
  });

  it('should submit the form with correct patchPayload', async () => {
    const mockPatchJSON = vi.spyOn(api, 'patchJSON').mockResolvedValue(authContextMock.user);

    const { getByLabelText, getByText, getByTestId } = renderAccount();

    fireEvent.change(getByLabelText(/First name/i), { target: { value: 'Jane' } });
    fireEvent.change(getByLabelText(/Email/i), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(getByTestId('account-password-one'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText(/Repeat password/i), { target: { value: 'password123' } });

    fireEvent.click(getByText(/Save/i));

    await waitFor(() => {
      expect(mockPatchJSON).toHaveBeenCalledWith(expect.any(String), {
        name: 'Jane',
        email: 'jane.doe@example.com',
        password: 'password123',
        passwordAgain: 'password123',
      });
    });

    mockPatchJSON.mockRestore();
  });

  it('should render text based on new contentHeader component', () => {
    const { getByText } = renderAccount();

    expect(getByText('My')).toBeDefined();
    expect(getByText('Account')).toBeDefined();
    expect(getByText('account_my_account_hello')).toBeDefined();
    expect(getByText('Update and Manage, Your')).toBeDefined();
    expect(getByText('Data')).toBeDefined();
  });
});
