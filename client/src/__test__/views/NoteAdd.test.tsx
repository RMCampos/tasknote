import React from 'react';
import { render, fireEvent, waitFor, getByText, getByTestId } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import NoteAdd from '../../views/NoteAdd';
import AuthContext from '../../context/AuthContext';
import i18n from '../../i18n';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import TaskNoteRequest from '../../types/TaskNoteRequest';
import { NoteResponse } from '../../types/NoteResponse';

vi.mock('../../api-service/api');

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
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
    createdAt: new Date()
  },
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false,
  updateUser: vi.fn(),
};

describe('NoteAdd Component', () => {
  const renderNoteAdd = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={authContextMock}>
          <I18nextProvider i18n={i18n}>
            <NoteAdd />
          </I18nextProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('should render the NoteAdd component', () => {
    const { getByText } = renderNoteAdd();
    expect(getByText('note_form_title_label')).toBeDefined();
    expect(getByText('task_form_url_label')).toBeDefined();
    expect(getByText('note_form_content_label')).toBeDefined();
    expect(getByText('note_form_submit')).toBeDefined();
  });

  it('should show error message when form is invalid', async () => {
    const { getByText, getByRole } = renderNoteAdd();
    const submitButton = getByRole('button', { name: 'note_form_submit' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(getByText('Please fill in all the fields')).toBeDefined();
    });
  });

  it('should add a new note when form is valid', async () => {
    const { getByLabelText, getByTestId, getByRole } = renderNoteAdd();
    const descriptionInput = getByLabelText('note_form_title_label') as HTMLInputElement;
    const noteContentInput = getByTestId('note-content-input-area') as HTMLAreaElement;
    const submitButton = getByRole('button', { name: 'note_form_submit' });

    fireEvent.change(descriptionInput, { target: { value: 'New Note' } });
    fireEvent.change(noteContentInput, { target: { value: 'Note content' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const newNote: NoteResponse = {
        id: 0,
        title: 'New Note',
        description: 'Note content',
        url: ''
      }
      expect(api.postJSON).toHaveBeenCalledWith(ApiConfig.notesUrl, newNote);
    });
  });

  it('should render text based on new contentHeader component', () => {
    const { getByText } = renderNoteAdd();

    expect(getByText('All')).toBeDefined();
    expect(getByText('Notes')).toBeDefined();
    expect(getByText('Save your notes in plain text or Markdown format')).toBeDefined();
    expect(getByText('Create, Filter, and Easily Find')).toBeDefined();
    expect(getByText('Them')).toBeDefined();
  });
});
