import React from 'react';
// import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
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
  
  it('should render text based on new contentHeader component', () => {
    const { getByText } = render(
      <About />
    );

    expect(getByText('About the')).toBeDefined();
    expect(getByText('TaskNote App')).toBeDefined();
    expect(getByText('Find more information about us and the app')).toBeDefined();
    expect(getByText('Tasks and notes made')).toBeDefined();
    expect(getByText('Easy')).toBeDefined();
  });
});
