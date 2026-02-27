import React from 'react';
import { describe, vi, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ModalMarkdown from '../../components/ModalMarkdown';

describe('ModalMarkdown Component', () => {
  const props = {
    show: true,
    title: 'Test Title',
    markdownText: '# Test Markdown',
    onHide: vi.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

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

  it('should show Source and Copy buttons', () => {
    render(<ModalMarkdown {...props} />);

    expect(screen.getByTestId('modal-source-button')).toBeDefined();
    expect(screen.getByTestId('modal-copy-button')).toBeDefined();
  });

  it('should toggle to source view when Source button is clicked', () => {
    render(<ModalMarkdown {...props} />);

    expect(screen.queryByTestId('markdown-source-view')).toBeNull();

    fireEvent.click(screen.getByTestId('modal-source-button'));

    expect(screen.getByTestId('markdown-source-view')).toBeDefined();
    expect(screen.getByTestId('markdown-source-view').textContent).toBe('# Test Markdown');
  });

  it('should toggle back to rendered view when Source button is clicked again', () => {
    render(<ModalMarkdown {...props} />);

    fireEvent.click(screen.getByTestId('modal-source-button'));
    expect(screen.getByTestId('markdown-source-view')).toBeDefined();

    fireEvent.click(screen.getByTestId('modal-source-button'));
    expect(screen.queryByTestId('markdown-source-view')).toBeNull();
  });

  it('should call clipboard writeText with markdownText when Copy button is clicked', async () => {
    render(<ModalMarkdown {...props} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('modal-copy-button'));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('# Test Markdown');
  });

  it('should show "Copied!" text after Copy button is clicked', async () => {
    render(<ModalMarkdown {...props} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('modal-copy-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal-copy-button').textContent).toBe('Copied!');
    });
  });

  it('should reset source view state when modal is closed', () => {
    render(<ModalMarkdown {...props} />);

    fireEvent.click(screen.getByTestId('modal-source-button'));
    expect(screen.getByTestId('markdown-source-view')).toBeDefined();

    fireEvent.click(screen.getByText('Close'));
    expect(props.onHide).toHaveBeenCalled();
  });
});