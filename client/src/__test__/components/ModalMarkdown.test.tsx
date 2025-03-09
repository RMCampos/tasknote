import React from 'react';
import { describe, vi, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalMarkdown from '../../components/ModalMarkdown';

describe('ModalMarkdown Component', () => {
  const props = {
    show: true,
    title: 'Test Title',
    markdownText: '# Test Markdown',
    onHide: vi.fn(),
  };

  it('should render the modal with the correct title and markdown text', () => {
    render(<ModalMarkdown {...props} />);

    expect(screen.getByTestId('modal-header-title').innerHTML).toBe('Test Title');
    expect(screen.getByText('Test Markdown')).toBeDefined();
  });

  it('should call onHide when the close button is clicked', () => {
    render(<ModalMarkdown {...props} />);

    fireEvent.click(screen.getByText('Close'));
    expect(props.onHide).toHaveBeenCalled();
  });

  it('should not render the modal when show is false', () => {
    render(<ModalMarkdown {...props} show={false} />);

    expect(screen.queryByTestId('modal-header-title')).toBeNull();
  });

  it('should render "No title" when title is an empty string', () => {
    render(<ModalMarkdown {...props} title="" />);

    expect(screen.getByTestId('modal-header-title').innerHTML).toBe('No title');
  });
});