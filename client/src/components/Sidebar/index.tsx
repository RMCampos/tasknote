import React, { useContext, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import SidebarContext from '../../context/SidebarContext';
import NavButton from '../NavButton';
import SidebarIcon from '../SidebarIcon';
import { env } from '../../env';
import './style.scss';

interface Props {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

/**
 * Sidebar component renders the sidebar navigation menu.
 *
 * @returns {React.ReactNode} The rendered Sidebar component.
 */
function Sidebar(props: React.PropsWithChildren<Props>): React.ReactNode {
  const { signOut, user } = useContext(AuthContext);
  const { currentPage, setNewPage } = useContext(SidebarContext);
  const { t } = useTranslation();
  const build = `Build: ${env.VITE_BUILD}`;

  // Note: when selected, change class to plus-jakarta-sans-thin and add background

  const logout = (): void => {
    setNewPage('/home');
    signOut();
  };
  useEffect(() => {}, [user, currentPage]);

  return (
    <>
      <button
        className="d-md-none position-fixed top-0 start-0 btn btn-light m-2 z-3"
        onClick={() => props.setIsMobileOpen(!props.isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      <div className={`d-flex flex-column vh-100 sidebar ${props.isMobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header plus-jakarta-sans-bold">
          <img src={`https://gravatar.com/avatar/${user?.gravatarImageUrl}.jpg`} alt="User icon" />
          <span className="header-username">{user?.name ? user?.name : 'User'}</span>
        </div>

        <div className="header-spacer"></div>

        <div className="sidebar-menu-header plus-jakarta-sans-regular">Main Menu</div>

        <Nav className="flex-column p-3 plus-jakarta-sans-thin">
          <NavLink to="/home" className="mb-2" onClick={() => setNewPage('/home')}>
            <div className={`sidebar-nav ${currentPage === '/home' ? 'selected' : ''}`}>
              <SidebarIcon
                iconName="dashboard"
                selected={currentPage === '/home'}
              />
              Dashboard
            </div>
          </NavLink>
          <NavLink to="/tasks" className="mb-2" onClick={() => setNewPage('/tasks')}>
            <div className={`sidebar-nav ${currentPage.includes('/tasks') ? 'selected' : ''}`}>
              <SidebarIcon
                iconName="tasks"
                selected={currentPage.includes('/tasks')}
              />
              {t('home_nav_tasks')}
            </div>
          </NavLink>
          <NavLink to="/notes" className="mb-2" onClick={() => setNewPage('/notes')}>
            <div className={`sidebar-nav ${currentPage.includes('/notes') ? 'selected' : ''}`}>
              <SidebarIcon
                iconName="notes"
                selected={currentPage.includes('/notes')}
              />
              {t('home_nav_notes')}
            </div>
          </NavLink>
        </Nav>

        <div className="sidebar-menu-header plus-jakarta-sans-regular">Preferences</div>

        <Nav className="flex-column p-3 plus-jakarta-sans-thin">
          <NavLink to="/account" className="mb-2" onClick={() => setNewPage('/account')}>
            <div className={`sidebar-nav ${currentPage === '/account' ? 'selected' : ''}`}>
              <SidebarIcon
                iconName="account"
                selected={currentPage === '/account'}
              />
              {t('footer_my_account')}
            </div>
          </NavLink>
          <NavLink to="/about" className="mb-2" onClick={() => setNewPage('/about')}>
            <div className={`sidebar-nav ${currentPage === '/about' ? 'selected' : ''}`}>
              <SidebarIcon
                iconName="about"
                selected={currentPage === '/about'}
              />
              {t('home_nav_about')}
            </div>
          </NavLink>
          <NavButton className="mb-2" onClick={() => logout()}>
            <div className="sidebar-nav">
              <SidebarIcon
                iconName="logout"
              />
              {t('logout')}
            </div>
          </NavButton>
        </Nav>

        {/* Footer at the bottom */}
        <div className="mt-auto text-center text-muted py-3">
          <small data-testid="footer-text">
            {build}
          </small>
        </div>
      </div>

      {props.isMobileOpen && (
        <button
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1 }}
          onClick={() => props.setIsMobileOpen(false)}
          aria-label="Close mobile menu"
        />
      )}
    </>
  );
}

export default Sidebar;
