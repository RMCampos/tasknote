import React from 'react';
import { MemoryRouter } from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskResponse } from '../../types/TaskResponse';
import api from '../../api-service/api';
import Task from '../../views/Task';
import '../../i18n';

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

const mockTask: TaskResponse[] = [
  {
    id: 1,
    description: 'Task_one',
    done: false,
    highPriority: false,
    dueDate: '',
    dueDateFmt: '',
    lastUpdate: '1 day ago',
    tag: 'test1',
    urls: ['http://test.copm']
  },
  {
    id: 2,
    description: 'Task_two',
    done: false,
    highPriority: true,
    dueDate: '2025-12-31',
    dueDateFmt: '7 months left',
    lastUpdate: '2 days ago',
    tag: 'test2',
    urls: ['http://test.copm']
  },
  {
    id: 3,
    description: 'Task_three',
    done: true,
    highPriority: true,
    dueDate: '',
    dueDateFmt: '',
    lastUpdate: '3 days ago',
    tag: 'test3',
    urls: ['http://test.copm']
  }
];

describe('Renders the task view', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTask = () => {
    return render(
      <MemoryRouter>
        <Task />
      </MemoryRouter>
    );
  };

  it('should render the Task view and load tasks', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockTask);

    renderTask();

    await waitFor(() => {
      // normal priority task
      expect(screen.getByText('Task_one')).toBeDefined();
      expect(Array.from(screen.getByTestId('task-title-text-Task_one').classList).join(' ')).toBe('poppins-semibold');
      
      // high priority task
      expect(screen.getByText('Task_two')).toBeDefined();
      expect(Array.from(screen.getByTestId('task-title-text-Task_two').classList).join(' ')).toBe('poppins-semibold');

      // done task
      expect(screen.getByText('Task_three')).toBeDefined();
      expect(Array.from(screen.getByTestId('task-title-text-Task_three').classList).join(' ')).toBe('ms-2 text-strike poppins-semibold');
    });
  });

  it('should filter notes based on input text', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockTask);

    renderTask();

    await waitFor(() => {
      expect(screen.getByText('Task_one')).toBeDefined();
      expect(screen.getByText('Task_two')).toBeDefined();
      expect(screen.getByText('Task_three')).toBeDefined();
    });

    // filter by text 'one'
    fireEvent.change(screen.getByPlaceholderText('Filter tasks'), { target: { value: 'one' } });

    expect(screen.getByText('Task_one')).toBeDefined();
    expect(screen.queryByText('Task_two')).toBeNull();
    expect(screen.queryByText('Task_three')).toBeNull();
  });

  it('should filter notes based on radio change', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockTask);

    renderTask();

    await waitFor(() => {
      expect(screen.getByText('Task_one')).toBeDefined();
      expect(screen.getByText('Task_two')).toBeDefined();
      expect(screen.getByText('Task_three')).toBeDefined();
    });

    // filter only completed
    fireEvent.click(screen.getByLabelText('Completed'));

    expect(screen.queryByText('Task_one')).toBeNull();
    expect(screen.queryByText('Task_two')).toBeNull();
    expect(screen.getByText('Task_three')).toBeDefined();
  });
});
