import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import ContentHeader from '../../components/ContentHeader';

const headerProps = {
  h1TextRegular: "Title part one",
  h1TextBold: "Title part two",
  subtitle: "This is the subtitle",
  h2BlackText: "Another text part one",
  h2GreenText: "Another green text",
  isHomeComponent: false
};

describe('ContentHeader test cases', () => {
  it('should render all the text elements', () => {
    const { getByText } = render(<ContentHeader {...headerProps} />);

    expect(getByText(headerProps.h1TextRegular)).toBeDefined();
    expect(getByText(headerProps.h1TextBold)).toBeDefined();
    expect(getByText(headerProps.subtitle)).toBeDefined();
    expect(getByText(headerProps.h2BlackText)).toBeDefined();
    expect(getByText(headerProps.h2GreenText)).toBeDefined();
  });

  it('should render all the text elements', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ContentHeader
        { ...headerProps }
        isHomeComponent={true}
        />
      </MemoryRouter>
    );

    expect(getByText(headerProps.h1TextRegular)).toBeDefined();
    expect(getByText(headerProps.h1TextBold)).toBeDefined();
    expect(getByText(headerProps.subtitle)).toBeDefined();
    expect(getByText(headerProps.h2BlackText)).toBeDefined();
    expect(getByText(headerProps.h2GreenText)).toBeDefined();
    
    // renders only if it's the home (dashboard)
    expect(getByText("Add note")).toBeDefined();
    expect(getByText("Add task")).toBeDefined();
  });
});
