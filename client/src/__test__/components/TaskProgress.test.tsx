import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import api from '../../api-service/api';
import { SummaryResponse } from '../../types/SummaryResponse';
import TaskProgress from '../../components/TaskProgress';

vi.mock('../../api-service/api');

describe('TaskProgress Component', () => {
  it('should render after fetching', async () => {
    const mockData: SummaryResponse = {
      pendingTaskCount: 354,
      doneTaskCount: 555,
      notesCount: 2222
    };
    const mockedGetJSON = vi.spyOn(api, 'getJSON').mockResolvedValue(mockData);

    act(() => {
      render(<TaskProgress />);
    });

    expect(mockedGetJSON).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('Total')).toBeDefined();
      expect(screen.queryByText(mockData.pendingTaskCount + mockData.doneTaskCount)).toBeDefined();
      expect(screen.queryByText('Pending')).toBeDefined();
      expect(screen.queryByText(mockData.pendingTaskCount)).toBeDefined();
      expect(screen.queryByText('Completed')).toBeDefined();
      expect(screen.queryByText(mockData.doneTaskCount)).toBeDefined();
    });
  });
});
