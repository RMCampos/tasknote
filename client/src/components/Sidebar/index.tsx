import React, { useContext, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import UserIcon from '../../assets/user.png';
import NavButton from '../NavButton';
import { env } from '../../env';
import './style.css';

function Sidebar(): React.ReactNode {
  const { signOut } = useContext(AuthContext);
  const { t } = useTranslation();
  const build = `Build: ${env.VITE_BUILD}`;
  const [current, setCurrent] = useState<string>('/home');

  // Note: when selected, change class to plus-jakarta-sans-thin and add background

  const goOut = () => {
    signOut();
  };

  const getSelectedColor = (path: string): string => {
    if (path === current) {
      return '#4CD964';
    }
    return '#6A8996';
  };

  const navLinkClicked = (menu: string): void => {
    setCurrent(menu);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light sidebar">
      <div className="sidebar-header plus-jakarta-sans-bold">
        <img width="45" src={UserIcon} alt="User icon" />
        <span>Ricardo Campos</span>
      </div>

      <div className="header-spacer"></div>

      <div className="sidebar-menu-header plus-jakarta-sans-regular">Main Menu</div>

      <Nav className="flex-column p-3 plus-jakarta-sans-thin">
        <NavLink to="/home" className="mb-2" onClick={() => navLinkClicked('/home')}>
          <div className={`sidebar-nav ${current === '/home' ? 'selected' : ''}`}>
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M14.056 0.966675H17.4373C18.8376 0.966675 19.9723 2.23093 19.9723 3.79117V7.55857C19.9723 9.1188 18.8376 10.3831 17.4373 10.3831H14.056C12.6557 10.3831 11.521 9.1188 11.521 7.55857V3.79117C11.521 2.23093 12.6557 0.966675 14.056 0.966675Z" fill={getSelectedColor('/home')} />
              <path d="M5.91626 13.617C7.31658 13.617 8.45126 14.8812 8.45126 16.4414V20.2088C8.45126 21.768 7.31658 23.0333 5.91626 23.0333H2.535C1.13468 23.0333 0 21.768 0 20.2088V16.4414C0 14.8812 1.13468 13.617 2.535 13.617H5.91626ZM17.4372 13.617C18.8375 13.617 19.9722 14.8812 19.9722 16.4414V20.2088C19.9722 21.768 18.8375 23.0333 17.4372 23.0333H14.056C12.6556 23.0333 11.521 21.768 11.521 20.2088V16.4414C11.521 14.8812 12.6556 13.617 14.056 13.617H17.4372ZM5.91626 0.966675C7.31658 0.966675 8.45126 2.23093 8.45126 3.79117V7.55857C8.45126 9.1188 7.31658 10.3831 5.91626 10.3831H2.535C1.13468 10.3831 0 9.1188 0 7.55857V3.79117C0 2.23093 1.13468 0.966675 2.535 0.966675H5.91626Z" fill={getSelectedColor('/home')} />
            </svg>
            Dashboard
          </div>
        </NavLink>
        <NavLink to="/tasks" className="mb-2" onClick={() => navLinkClicked('/tasks')}>
          <div className={`sidebar-nav ${current === '/tasks' ? 'selected' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3333 7.56248V16.5C18.3333 19.25 16.6925 20.1666 14.6666 20.1666H7.33329C5.30746 20.1666 3.66663 19.25 3.66663 16.5V7.56248C3.66663 4.58331 5.30746 3.89581 7.33329 3.89581C7.33329 4.46415 7.56243 4.97748 7.93827 5.35331C8.3141 5.72914 8.82746 5.95831 9.39579 5.95831H12.6041C13.7408 5.95831 14.6666 5.03248 14.6666 3.89581C16.6925 3.89581 18.3333 4.58331 18.3333 7.56248Z" stroke={getSelectedColor('/tasks')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.6667 3.89581C14.6667 5.03248 13.7409 5.95831 12.6042 5.95831H9.39587C8.82754 5.95831 8.31418 5.72914 7.93835 5.35331C7.56252 4.97748 7.33337 4.46415 7.33337 3.89581C7.33337 2.75915 8.25921 1.83331 9.39587 1.83331H12.6042C13.1725 1.83331 13.6859 2.06248 14.0617 2.43832C14.4376 2.81415 14.6667 3.32748 14.6667 3.89581Z" stroke={getSelectedColor('/tasks')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.33337 11.9167H11" stroke={getSelectedColor('/tasks')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.33337 15.5833H14.6667" stroke={getSelectedColor('/tasks')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('home_nav_tasks')}
          </div>
        </NavLink>
        <NavLink to="/notes" className="mb-2" onClick={() => navLinkClicked('/notes')}>
          <div className={`sidebar-nav ${current === '/notes' ? 'selected' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.2411 16.875H3.75C3.58424 16.875 3.42527 16.8092 3.30806 16.6919C3.19085 16.5747 3.125 16.4158 3.125 16.25V3.75C3.125 3.58424 3.19085 3.42527 3.30806 3.30806C3.42527 3.19085 3.58424 3.125 3.75 3.125H16.25C16.4158 3.125 16.5747 3.19085 16.6919 3.30806C16.8092 3.42527 16.875 3.58424 16.875 3.75V12.2411C16.875 12.3232 16.8588 12.4045 16.8274 12.4803C16.796 12.5561 16.75 12.625 16.6919 12.6831L12.6831 16.6919C12.625 16.75 12.5561 16.796 12.4803 16.8274C12.4045 16.8588 12.3232 16.875 12.2411 16.875V16.875Z" stroke={getSelectedColor('/notes')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.8188 12.4994H12.5V16.8181" stroke={getSelectedColor('/notes')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('home_nav_notes')}
          </div>
        </NavLink>
      </Nav>

      <div className="sidebar-menu-header plus-jakarta-sans-regular">Preferences</div>

      <Nav className="flex-column p-3 plus-jakarta-sans-thin">
        <NavLink to="/account" className="mb-2" onClick={() => navLinkClicked('/account')}>
          <div className={`sidebar-nav ${current === '/account' ? 'selected' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke={getSelectedColor('/account')} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.83337 11.8066V10.1933C1.83337 9.23998 2.61254 8.45165 3.57504 8.45165C5.23421 8.45165 5.91254 7.27832 5.07837 5.83915C4.60171 5.01415 4.88587 3.94165 5.72004 3.46498L7.30587 2.55748C8.03004 2.12665 8.96504 2.38332 9.39587 3.10748L9.49671 3.28165C10.3217 4.72082 11.6784 4.72082 12.5125 3.28165L12.6134 3.10748C13.0442 2.38332 13.9792 2.12665 14.7034 2.55748L16.2892 3.46498C17.1234 3.94165 17.4075 5.01415 16.9309 5.83915C16.0967 7.27832 16.775 8.45165 18.4342 8.45165C19.3875 8.45165 20.1759 9.23082 20.1759 10.1933V11.8066C20.1759 12.76 19.3967 13.5483 18.4342 13.5483C16.775 13.5483 16.0967 14.7216 16.9309 16.1608C17.4075 16.995 17.1234 18.0583 16.2892 18.535L14.7034 19.4425C13.9792 19.8733 13.0442 19.6166 12.6134 18.8925L12.5125 18.7183C11.6875 17.2791 10.3309 17.2791 9.49671 18.7183L9.39587 18.8925C8.96504 19.6166 8.03004 19.8733 7.30587 19.4425L5.72004 18.535C4.88587 18.0583 4.60171 16.9858 5.07837 16.1608C5.91254 14.7216 5.23421 13.5483 3.57504 13.5483C2.61254 13.5483 1.83337 12.76 1.83337 11.8066Z" stroke={getSelectedColor('/account')} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('footer_my_account')}
          </div>
        </NavLink>
        <NavLink to="/about" className="mb-2" onClick={() => navLinkClicked('/about')}>
          <div className={`sidebar-nav ${current === '/about' ? 'selected' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5834 16.8943H11.9167L7.83753 19.6076C7.23253 20.0109 6.41671 19.5801 6.41671 18.8468V16.8943C3.66671 16.8943 1.83337 15.0609 1.83337 12.3109V6.81087C1.83337 4.06087 3.66671 2.22754 6.41671 2.22754H15.5834C18.3334 2.22754 20.1667 4.06087 20.1667 6.81087V12.3109C20.1667 15.0609 18.3334 16.8943 15.5834 16.8943Z" stroke={getSelectedColor('/about')} strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 10.4133V10.2209C11 9.59753 11.3851 9.26752 11.7701 9.00168C12.1459 8.74502 12.5217 8.41503 12.5217 7.81003C12.5217 6.96669 11.8434 6.28833 11 6.28833C10.1567 6.28833 9.47839 6.96669 9.47839 7.81003" stroke={getSelectedColor('/about')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.9958 12.6042H11.0041" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('home_nav_about')}
          </div>
        </NavLink>
        <NavButton className="mb-2" onClick={() => goOut()}>
          <div className="sidebar-nav">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4082 0.333374C14.3045 0.333374 16.6667 2.65504 16.6667 5.51337V11.1017H9.54461C9.0342 11.1017 8.63061 11.4984 8.63061 12C8.63061 12.49 9.0342 12.8984 9.54461 12.8984H16.6667V18.475C16.6667 21.3334 14.3045 23.6667 11.3845 23.6667H5.60372C2.69553 23.6667 0.333374 21.345 0.333374 18.4867V5.52504C0.333374 2.65504 2.70741 0.333374 5.61559 0.333374H11.4082ZM19.6303 7.97527C19.9803 7.61361 20.5519 7.61361 20.9019 7.96361L24.3086 11.3586C24.4836 11.5336 24.5769 11.7553 24.5769 12.0003C24.5769 12.2336 24.4836 12.4669 24.3086 12.6303L20.9019 16.0253C20.7269 16.2003 20.4936 16.2936 20.2719 16.2936C20.0386 16.2936 19.8053 16.2003 19.6303 16.0253C19.2803 15.6753 19.2803 15.1036 19.6303 14.7536L21.4969 12.8986H16.6669V11.1019H21.4969L19.6303 9.24694C19.2803 8.89694 19.2803 8.32527 19.6303 7.97527Z" fill="#FB1A41" />
            </svg>
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
