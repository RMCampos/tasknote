import React from 'react';
import { test } from 'vitest';
import App from '../App';
import { render } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import authContextMock from './__mocks__/authContextMock';

test('Renders the app', () => {
  render(
    <AuthContext.Provider value={authContextMock}>
      <App />
    </AuthContext.Provider>
  );
});
