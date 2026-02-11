import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthProvider from './context/AuthProvider';
import FilterProvider from './context/FilterProvider';
import SidebarProvider from './context/SidebarProvider';
import './i18n';

window.global ||= window;

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FilterProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </FilterProvider>
    </AuthProvider>
  </React.StrictMode>
);
