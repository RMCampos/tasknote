import React, { useContext, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import SidebarContext from '../../context/SidebarContext';
import NavButton from '../NavButton';
import { env } from '../../env';
import './style.scss';
import { BoxArrowRight, InfoCircleFill, PersonFill, StarFill } from 'react-bootstrap-icons';

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

  const isHomeSelected = (): string => {
    const isHomeSelection: boolean = currentPage === '/home'
      || currentPage == '/tasks/new'
      || currentPage.includes('/tasks/edit')
      || currentPage == '/notes/new'
      || currentPage.includes('/notes/edit');

    if (isHomeSelection) {
      return 'selected';
    }

    return '';
  };

  useEffect(() => {}, [user, currentPage]);

  return (
    <>
      <button
        className="d-lg-none position-fixed top-0 start-0 btn btn-light m-2 z-3"
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

        <Nav className="flex-column p-3 plus-jakarta-sans-thin">
          <NavLink to="/home" className="mb-2" onClick={() => setNewPage('/home')}>
            <div className={`sidebar-nav ${isHomeSelected()}`}>
              <StarFill />
              Home
            </div>
          </NavLink>
          <NavLink to="/account" className="mb-2" onClick={() => setNewPage('/account')}>
            <div className={`sidebar-nav ${currentPage === '/account' ? 'selected' : ''}`}>
              <PersonFill />
              {t('footer_my_account')}
            </div>
          </NavLink>
          <NavLink to="/about" className="mb-2" onClick={() => setNewPage('/about')}>
            <div className={`sidebar-nav ${currentPage === '/about' ? 'selected' : ''}`}>
              <InfoCircleFill />
              {t('home_nav_about')}
            </div>
          </NavLink>
          <NavButton className="mb-2" onClick={() => logout()}>
            <div className="sidebar-nav">
              <BoxArrowRight />
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
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1 }}
          onClick={() => props.setIsMobileOpen(false)}
          aria-label="Close mobile menu"
        />
      )}
    </>
  );
}

export default Sidebar;
