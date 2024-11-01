import React, { useCallback, useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import { handleDefaultLang } from '../../lang-service/LangHandler';
import { setDefaultLang } from '../../storage-service/storage';
import './styles.scss';
import { LangAvailable, languages } from '../../constants/languages_available';

/**
 * Landing page component.
 *
 * This component displays the landing page of the application,
 * providing navigation to login or register.
 * It also checks for an existing user session.
 *
 * @returns {JSX.Element} The Landing page component.
 */
function Landing(): JSX.Element {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  /**
   * Navigates to the specified page.
   *
   * @param {string} page - The page to navigate to.
   */
  const goTo = useCallback((page: string): void => {
    navigate(page);
  }, []);

  /**
   * Handles the login button click event.
   *
   * If a user is already signed in, it navigates to the home page.
   * Otherwise, it navigates to the login page.
   */
  const handleLogin = (): void => {
    if (signed) {
      goTo('/home');
    }
    else {
      goTo('/login');
    }
  };

  const handleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setDefaultLang(lang);
  };

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
    handleDefaultLang();
  }, []);

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center landing-page">
      <div>
        <h1 className="display-4">
          {t('landing_title')}
        </h1>
        <p className="lead">
          {t('landing_subtitle')}
        </p>

        <Button
          type="button"
          variant="primary"
          className="btn-lg me-3"
          onClick={handleLogin}
        >
          {t('landing_btn_login')}
        </Button>

        <Button
          variant="outline-primary"
          className="btn-lg me-3"
          type="button"
          onClick={() => goTo('/register')}
        >
          {t('landing_btn_register')}
        </Button>

        <br />

        <div className="my-3">
          {languages.map((lang: LangAvailable) => (
            <Button
              key={lang.key}
              type="button"
              variant="outline-primary"
              className="btn-sm me-3"
              onClick={() => handleLanguage(lang.lang)}
            >
              {t(lang.key)}
            </Button>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Landing;
