import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Task from '../../views/Task';
import '../../i18n';

describe('Renders the task view', () => {
  it('should render the task view', async() => {
    render(
      <MemoryRouter>
        <Task />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.querySelector('.main-margin')).toBeDefined();
    });
  });
});
