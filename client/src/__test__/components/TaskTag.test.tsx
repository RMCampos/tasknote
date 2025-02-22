import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskTag from '../../components/TaskTag';

describe('TaskTag Component', () => {
  it('should render the TaskTag component with provided tag and last update', () => {
    const { getByText } = render(<TaskTag tag="important" lastUpdate="2025-02-20" />);
    expect(getByText('#important')).toBeDefined();
    expect(getByText('2025-02-20')).toBeDefined();
  });

  it('should render the TaskTag component with default tag when no tag is provided', () => {
    const { getByText } = render(<TaskTag lastUpdate="2025-02-20" />);
    expect(getByText('#untagged')).toBeDefined();
    expect(getByText('2025-02-20')).toBeDefined();
  });
});
