import React from 'react';
import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import Account from '../../views/Account';
import AuthContext from '../../context/AuthContext';
import i18n from '../../i18n';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

vi.mock('../../api-service/api');

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: vi.fn(),
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
  user: { email: 'test@example.com' },
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false
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
    expect(getByText('account_my_account_tittle')).toBeDefined();
    expect(getByText('account_my_account_hello')).toBeDefined();
    expect(getByText('account_my_account_logged')).toBeDefined();
    expect(getByText('test@example.com')).toBeDefined();
  });

  // it('should change language when a language button is clicked', () => {
  //   const { getByText } = renderAccount();
  //   const languageButton = getByText('account_app_lang_tittle');
  //   fireEvent.click(languageButton);
  //   expect(changeLanguageMock).toHaveBeenCalled();
  // });

  it('should show alert when delete button is clicked', () => {
    const { getByText } = renderAccount();
    const deleteButton = getByText('account_privacy_delete_btn');
    fireEvent.click(deleteButton);
    expect(getByText('account_delete_tittle')).toBeDefined();
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
});
