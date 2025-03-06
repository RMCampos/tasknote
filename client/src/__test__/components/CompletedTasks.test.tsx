import React from 'react';
import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../api-service/api';
import { TasksChartResponse } from '../../types/TasksChartResponse';
import CompletedTasks from '../../components/CompletedTasks';

// Mock the Chart component
vi.mock('react-charts', () => ({
  Chart: ({ options }) => <div data-testid="mocked-chart">Mocked Chart</div>
}));

vi.mock('../../api-service/api');

describe('CompletedTasks Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render loading state initially', async () => {
    // Create a promise that never resolves
    vi.spyOn(api, 'getJSON').mockImplementation(() => new Promise(() => {}));
  
    act(() => {
      render(<CompletedTasks />);
    });

    expect(screen.getByText('Loading...')).toBeDefined();
  });
  
  it('should render chart with data after fetching', async () => {
    const mockData: TasksChartResponse[] = [
      { day: 'S', count: 5, date: new Date() },
      { day: 'M', count: 10, date: new Date() },
    ];
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockData);
    
    act(() => {
      render(<CompletedTasks />);
    });

    expect(screen.getByText('Loading...')).toBeDefined();

    await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
  
    expect(screen.queryByText('Loading...')).toBeNull();
    expect(screen.getByText('Completed Tasks')).toBeDefined();
    expect(screen.getByText('Summary from the last 7 days')).toBeDefined();
  });
});
