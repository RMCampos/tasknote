import React from 'react';
import { test } from 'vitest';
import { render } from '@testing-library/react';
import Task from '../../views/Task';
import '../../i18n';

test('Renders the task view', () => {
  render(
      <Task />
  );
});
