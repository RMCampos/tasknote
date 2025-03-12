import React from 'react';
import { render, fireEvent, waitFor, getByText } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import TaskAdd from '../../views/TaskAdd';
import AuthContext from '../../context/AuthContext';
import i18n from '../../i18n';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import TaskNoteRequest from '../../types/TaskNoteRequest';

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
    createdAt: new Date(),
    gravatarImageUrl: 'http://url.com'
  },
  checkCurrentAuthUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  register: vi.fn(),
  isAdmin: false,
  updateUser: vi.fn(),
};

describe('TaskAdd Component', () => {
  const renderTaskAdd = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={authContextMock}>
          <I18nextProvider i18n={i18n}>
            <TaskAdd />
          </I18nextProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
  };

  it('should render the TaskAdd component', () => {
    const { getByText } = renderTaskAdd();
    expect(getByText('task_form_title')).toBeDefined();
    expect(getByText('task_form_desc_label')).toBeDefined();
    expect(getByText('task_form_url_label')).toBeDefined();
    expect(getByText('task_form_duedate_label')).toBeDefined();
    expect(getByText('task_form_submit')).toBeDefined();
  });

  it('should show error message when form is invalid', async () => {
    const { getByText, getByRole } = renderTaskAdd();
    const submitButton = getByRole('button', { name: 'task_form_submit' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(getByText('Please fill in all the fields')).toBeDefined();
    });
  });

  it('should add a new task when form is valid', async () => {
    const { getByLabelText, getByRole } = renderTaskAdd();
    const descriptionInput = getByLabelText('task_form_desc_label') as HTMLInputElement;
    const submitButton = getByRole('button', { name: 'task_form_submit' });

    fireEvent.change(descriptionInput, { target: { value: 'New Task' } });
    expect(descriptionInput.value).toBe('New Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const newTask: TaskNoteRequest = {
        description: 'New Task',
        dueDate: '',
        highPriority: false,
        tag: '',
        urls: []
      }
      expect(api.postJSON).toHaveBeenCalledWith(ApiConfig.tasksUrl, newTask);
    });
  });

  it('should render text based on new contentHeader component', () => {
    const { getByText } = renderTaskAdd();

    expect(getByText('All')).toBeDefined();
    expect(getByText('Tasks')).toBeDefined();
    expect(getByText('Be on top of your TODO list')).toBeDefined();
    expect(getByText('Create, Filter, and Easily Find')).toBeDefined();
    expect(getByText('Them')).toBeDefined();
  });
});
