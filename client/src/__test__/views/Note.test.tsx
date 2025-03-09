import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api-service/api';
import { NoteResponse } from '../../types/NoteResponse';
import ApiConfig from '../../api-service/apiConfig';
import Note from '../../views/Note';
import { MemoryRouter } from 'react-router';

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

const mockNotes: NoteResponse[] = [
  {
    id: 1,
    title: 'Test Note 1',
    description: 'This is a test note 1',
    url: 'http://example.com/1',
  },
  {
    id: 2,
    title: 'Test Note 2',
    description: 'This is a test note 2',
    url: 'http://example.com/2',
  },
];

describe('Note Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNote = () => {
    return render(
      <MemoryRouter>
        <Note />
      </MemoryRouter>
    );
  };

  it('should render the Note component and load notes', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockNotes);

    renderNote();

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeDefined();
      expect(screen.getByText('Test Note 2')).toBeDefined();
    });
  });

  it('should filter notes based on input', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockNotes);

    renderNote();

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeDefined();
      expect(screen.getByText('Test Note 2')).toBeDefined();
    });

    fireEvent.change(screen.getByPlaceholderText('Filter notes'), { target: { value: '1' } });

    expect(screen.getByText('Test Note 1')).toBeDefined();
    expect(screen.queryByText('Test Note 2')).toBeNull();
  });

  it('should show the markdown preview modal when "Preview Markdown" is clicked', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockNotes);

    renderNote();

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('preview-markdown-link-1'));

    expect(screen.getByTestId('modal-header-title').innerHTML).toBe('Test Note 1');
    expect(screen.getByText('This is a test note 1')).toBeDefined();
  });

  it('should call deleteNote when delete action is clicked', async () => {
    vi.spyOn(api, 'getJSON').mockResolvedValue(mockNotes);
    vi.spyOn(api, 'deleteNoContent').mockResolvedValue(mockNotes);

    renderNote();

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeDefined();
    });

    fireEvent.click(screen.getByText('Test Note 1'));
    fireEvent.click(screen.getByTestId('note-dropdown-menu-1'));
    fireEvent.click(screen.getByTestId('note-dropdown-delete-item-1'));

    await waitFor(() => {
      expect(api.deleteNoContent).toHaveBeenCalledWith(`${ApiConfig.notesUrl}/1`);
    });
  });
});
