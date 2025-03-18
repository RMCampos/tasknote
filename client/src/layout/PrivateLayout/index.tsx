import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../../components/Sidebar';
import './style.css';

/**
 * PrivateLayout component.
 *
 * This component provides the layout of the application,
 * including the outlet responsible for the main content.
 * It also includes the header and the footer.
 *
 * @returns {React.ReactNode} The Layout component.
 */
function PrivateLayout(): React.ReactNode {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  return (
    <div className="page-container">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className={`main-content ${isMobileOpen ? 'content-with-sidebar-mobile' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;
