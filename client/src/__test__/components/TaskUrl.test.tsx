import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskUrl from '../../components/TaskUrl';

describe('TaskUrl Component', () => {
  it('should render the TaskUrl component with a shortened URL', () => {
    const { getByText } = render(<TaskUrl url="https://www.example.com/some/very/long/url/that/needs/to/be/shortened" />);
    expect(getByText('example.com/some/very/long/url/that/needs/to/be/sh...')).toBeDefined();
  });

  it('should render the TaskUrl component with a full URL if it is short enough', () => {
    const { getByText } = render(<TaskUrl url="https://www.example.com" />);
    expect(getByText('example.com')).toBeDefined();
  });

  it('should render the TaskUrl component with a link', () => {
    const { getByText } = render(<TaskUrl url="https://www.example.com" />);
    const linkElement = getByText('example.com').closest('a');
    if (linkElement) {
      expect(linkElement.getAttribute('href')).toBe('https://www.example.com');
    }
  });
});
