import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import AuthContext from '../../context/AuthContext';
import Home from '../../views/Home';
import api from '../../api-service/api';
import '../../i18n';
import { TasksChartResponse } from '../../types/TasksChartResponse';
import { SummaryResponse } from '../../types/SummaryResponse';
import { TaskResponse } from '../../types/TaskResponse';
import { NoteResponse } from '../../types/NoteResponse';

vi.mock('react-charts', () => ({
  Chart: ({ options }) => <div data-testid="mocked-chart">Mocked Chart</div>
}));

vi.mock('../../api-service/api');

const mockAuthContext = {
  signed: true,
  user: {
    userId: 1,
    name: 'Ricardo',
    email: 'ricardo@campos.com',
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

const mockTags = ['work', 'personal'];
const mockTasks: TaskResponse[] = [
  { id: 1, description: 'Task 1', done: false, highPriority: false, dueDate: '', dueDateFmt: '', tag: 'tag1', urls: [], lastUpdate: 'Moments ago' },
  { id: 2, description: 'Task 2', done: false, highPriority: false, dueDate: '', dueDateFmt: '', tag: 'tag2', urls: [], lastUpdate: 'Moments ago' },
];

const mockNotes: NoteResponse[] = [
  { id: 1, title: 'Note 1', description: 'Description 1', url: '' },
  { id: 2, title: 'Note 2', description: 'Description 2', url: '' },
];
const mockChart: TasksChartResponse[] = [
  { day: 'S', count: 5, date: new Date() },
  { day: 'M', count: 10, date: new Date() },
];
const mockSummary: SummaryResponse = {
  pendingTaskCount: 354,
  doneTaskCount: 555,
  notesCount: 2222
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.spyOn(api, 'getJSON').mockImplementation((url) => {
      if (url.includes('/tasks/tags')) return Promise.resolve(mockTags);
      if (url.includes('/tasks/filter')) return Promise.resolve(mockTasks);
      if (url.includes('/summary')) return Promise.resolve(mockSummary);
      if (url.includes('/completed-tasks-chart')) return Promise.resolve(mockChart);
      if (url.includes('/search')) return Promise.resolve({ tasks: mockTasks, notes: mockNotes });
      return Promise.reject(new Error('Unknown endpoint'));
    });

    vi.spyOn(api, 'patchJSON').mockResolvedValue({});
    vi.spyOn(api, 'deleteNoContent').mockResolvedValue({});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Home />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  }

  it('renders the component with initial data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Welcome to TaskNote! Get ready to complete your pending tasks')).toBeDefined();
      expect(screen.getByText('🔥 High Priority')).toBeDefined();
      expect(screen.getByText('#work')).toBeDefined();
      expect(screen.getByText('#personal')).toBeDefined();
    });
  });

  it('handles search functionality', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search tasks & notes');
    const form = searchInput.closest('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Task' } });
      fireEvent.submit(form);
    });
    
    expect(screen.getByText('Task 1')).toBeDefined();
    expect(screen.getByText('Task 2')).toBeDefined();
    expect(screen.getByText('Note 1')).toBeDefined();
    expect(screen.getByText('Note 2')).toBeDefined();
  });

  it('handles search functionality with error', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search tasks & notes');
    const form = searchInput.closest('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.submit(form);
    });
    
    expect(screen.getByText('Please type at least 3 characters')).toBeDefined();
  });

  it('loads tasks based on filter', async () => {
    renderComponent();

    const highPriorityButton = screen.getByText('🔥 High Priority');

    await act(async () => {
      fireEvent.click(highPriorityButton);
    });

    expect(screen.getByText('Task 1')).toBeDefined();
    expect(screen.getByText('Task 2')).toBeDefined();
  });

  it('marks a task as done', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search tasks & notes');
    const form = searchInput.closest('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Task' } });
      fireEvent.submit(form);
    });

    const markAsDoneButton = screen.getByTestId('task-home-result-done-1');
    
    await act(async () => {
      fireEvent.click(markAsDoneButton!);
    });

    expect(api.patchJSON).toHaveBeenCalledWith(expect.stringContaining('/tasks/1'), expect.objectContaining({ done: true }));
  });

  it('deletes a task', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search tasks & notes');
    const form = searchInput.closest('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Task' } });
      fireEvent.submit(form);
    });

    const deleteButton = screen.getByTestId('task-home-result-delete-1');

    await act(async () => {
      fireEvent.click(deleteButton!);
    });

    expect(api.deleteNoContent).toHaveBeenCalledWith(expect.stringContaining('/tasks/1'));
  });

  it('opens a note in the modal', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search tasks & notes');
    const form = searchInput.closest('form') as HTMLFormElement;

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Task' } });
      fireEvent.submit(form);
    });

    const openNoteButton = screen.getByTestId('note-home-result-open-1');

    await act(async () => {
      fireEvent.click(openNoteButton!);
    });
    
    expect(screen.getByText('Description 1')).toBeDefined();
  });
});