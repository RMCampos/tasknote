import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults } from '../../components/SearchResults';
import { TaskResponse } from '../../types/TaskResponse';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('SearchResults Component', () => {
  const mockTaskAction = vi.fn();

  const sampleTasks: TaskResponse[] = [
    {
      id: 1,
      description: 'Task 1',
      done: false,
      highPriority: false,
      dueDate: '2023-10-01',
      dueDateFmt: '2023-10-01',
      lastUpdate: 'Some time ago',
      tag: 'tag1',
      urls: ['https://example.com'],
    },
    {
      id: 2,
      description: 'Task 2',
      done: false,
      highPriority: false,
      urls: [],
      dueDate: '',
      dueDateFmt: '',
      lastUpdate: 'Some time ago',
      tag: 'tag2'
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders "No tasks found" when results array is empty', () => {
    render(<SearchResults results={[]} taskAction={mockTaskAction} />);
    expect(screen.getByText(/No tasks found/i)).toBeDefined();
  });

  it('renders the correct number of tasks', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    expect(screen.getByText(/2 task\(s\) found/i)).toBeDefined();
    expect(screen.getByText('Task 1')).toBeDefined();
    expect(screen.getByText('Task 2')).toBeDefined();
  });

  it('triggers taskAction with "done" action when done icon is clicked', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    const doneButton = screen.getByTestId('task-home-result-done-1');
    fireEvent.click(doneButton);
    expect(mockTaskAction).toHaveBeenCalledWith('done', sampleTasks[0]);
  });

  it('triggers taskAction with "edit" action when edit icon is clicked', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    const editButton = screen.getByTestId('task-home-result-edit-1');
    fireEvent.click(editButton);
    expect(mockTaskAction).toHaveBeenCalledWith('edit', sampleTasks[0]);
  });

  it('triggers taskAction with "delete" action when delete icon is clicked', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    const deleteButton = screen.getByTestId('task-home-result-delete-1');
    fireEvent.click(deleteButton);
    expect(mockTaskAction).toHaveBeenCalledWith('delete', sampleTasks[0]);
  });

  it('renders external link icon when task has URLs', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    const externalLink = screen.getByAltText('external link');
    expect(externalLink).toBeDefined();
    // expect(externalLink.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders due date icon when task has a due date', () => {
    render(<SearchResults results={sampleTasks} taskAction={mockTaskAction} />);
    const dueDateIcon = screen.getByTitle('2023-10-01');
    expect(dueDateIcon).toBeDefined();
  });
});
