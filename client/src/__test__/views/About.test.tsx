import React from 'react';
// import { MemoryRouter } from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import About from '../../views/About';
import '../../i18n';

describe('Renders the about view', () => {
  it('should render the about view', async() => {
    render(
      <About />
    );

    expect(document.querySelector('.justify-content-center')).toBeDefined();
    expect(document.querySelector('.poppins-medium')).toBeDefined();
    expect(document.querySelector('.poppins-light')).toBeDefined();
  });
});
