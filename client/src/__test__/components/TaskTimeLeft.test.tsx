import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskTimeLeft from '../../components/TaskTimeLeft';

describe('TaskTimeLeft Component', () => {
  const renderComponent = (done: boolean) => {
    return render(
      <TaskTimeLeft
        text="2 days left"
        done={done}
        tooltip="2025-03-20"
      />
    );
  };

  it('should render the TaskTimeLeft component with text when task is not done', () => {
    const { getByText } = renderComponent(false);
    expect(getByText('2 days left')).toBeDefined();
  });

  it('should not render the TaskTimeLeft component when task is done', () => {
    const { queryByText } = renderComponent(true);
    expect(queryByText('2 days left')).toBeNull();
  });
});
