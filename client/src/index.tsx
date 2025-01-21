import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthProvider from './context/AuthProvider';
import './i18n';

window.global ||= window;

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
