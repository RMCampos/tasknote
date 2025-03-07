import React, { useContext, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import UserIcon from '../../assets/user.png';
import NavButton from '../NavButton';
import SidebarIcon from '../SidebarIcon';
import { env } from '../../env';
import './style.css';

/**
 * Sidebar component renders the sidebar navigation menu.
 *
 * @returns {React.ReactNode} The rendered Sidebar component.
 */
function Sidebar(): React.ReactNode {
  const { signOut, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const build = `Build: ${env.VITE_BUILD}`;
  const [current, setCurrent] = useState<string>('/home');

  // Note: when selected, change class to plus-jakarta-sans-thin and add background

  /**
   * Handles the sign-out action.
   */
  const goOut = (): void => {
    signOut();
  };

  /**
   * Handles the navigation link click event.
   *
   * @param {string} menu - The menu path.
   */
  const navLinkClicked = (menu: string): void => {
    setCurrent(menu);
  };

  useEffect(() => {}, [user]);

  return (
    <div className="d-flex flex-column vh-100 bg-light sidebar">
      <div className="sidebar-header plus-jakarta-sans-bold">
        <img width="45" src={UserIcon} alt="User icon" />
        <span>{user?.name ? user?.name : 'User'}</span>
      </div>

      <div className="header-spacer"></div>

      <div className="sidebar-menu-header plus-jakarta-sans-regular">Main Menu</div>

      <Nav className="flex-column p-3 plus-jakarta-sans-thin">
        <NavLink to="/home" className="mb-2" onClick={() => navLinkClicked('/home')}>
          <div className={`sidebar-nav ${current === '/home' ? 'selected' : ''}`}>
            <SidebarIcon
              iconName="dashboard"
              selected={current === '/home'}
            />
            Dashboard
          </div>
        </NavLink>
        <NavLink to="/tasks" className="mb-2" onClick={() => navLinkClicked('/tasks')}>
          <div className={`sidebar-nav ${current === '/tasks' ? 'selected' : ''}`}>
            <SidebarIcon
              iconName="tasks"
              selected={current === '/tasks'}
            />
            {t('home_nav_tasks')}
          </div>
        </NavLink>
        <NavLink to="/notes" className="mb-2" onClick={() => navLinkClicked('/notes')}>
          <div className={`sidebar-nav ${current === '/notes' ? 'selected' : ''}`}>
            <SidebarIcon
              iconName="notes"
              selected={current === '/notes'}
            />
            {t('home_nav_notes')}
          </div>
        </NavLink>
      </Nav>

      <div className="sidebar-menu-header plus-jakarta-sans-regular">Preferences</div>

      <Nav className="flex-column p-3 plus-jakarta-sans-thin">
        <NavLink to="/account" className="mb-2" onClick={() => navLinkClicked('/account')}>
          <div className={`sidebar-nav ${current === '/account' ? 'selected' : ''}`}>
            <SidebarIcon
              iconName="account"
              selected={current === '/account'}
            />
            {t('footer_my_account')}
          </div>
        </NavLink>
        <NavLink to="/about" className="mb-2" onClick={() => navLinkClicked('/about')}>
          <div className={`sidebar-nav ${current === '/about' ? 'selected' : ''}`}>
            <SidebarIcon
              iconName="about"
              selected={current === '/about'}
            />
            {t('home_nav_about')}
          </div>
        </NavLink>
        <NavButton className="mb-2" onClick={() => goOut()}>
          <div className="sidebar-nav">
            <SidebarIcon
              iconName="logout"
            />
            {t('logout')}
          </div>
        </NavButton>
      </Nav>

      {/* Footer at the bottom */}
      <div
        className="mt-auto text-center text-muted py-3"
        style={{ borderTop: '1px solid #ddd' }}
      >
        <small data-testid="footer-text">
          {build}
        </small>
      </div>
    </div>
  );
}

export default Sidebar;
