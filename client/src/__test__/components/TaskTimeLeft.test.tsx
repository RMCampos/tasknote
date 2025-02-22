import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskTimeLeft from '../../components/TaskTimeLeft';

describe('TaskTimeLeft Component', () => {
  it('should render the TaskTimeLeft component with text when task is not done', () => {
    const { getByText } = render(<TaskTimeLeft text="2 days left" done={false} />);
    expect(getByText('2 days left')).toBeDefined();
  });

  it('should not render the TaskTimeLeft component when task is done', () => {
    const { queryByText } = render(<TaskTimeLeft text="2 days left" done={true} />);
    expect(queryByText('2 days left')).toBeNull();
  });
});
