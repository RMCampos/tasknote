import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NoteTitle from '../../components/NoteTitle';

describe('NoteTitle test cases', () => {
  it('should render the note title', () => {
    const { getByText } = render(<NoteTitle title="Test Title" noteUrl={null} />)

    expect(getByText('Test Title')).toBeDefined();
  });
});
