import React, { useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
  const { checkCurrentAuthUser } = useContext(AuthContext);
  const { i18n, t } = useTranslation();

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
      <main>
        <h1 className="display-1">{t('landing_title')}</h1>
        <h2>{t('landing_subtitle')}</h2>

        <Link to="/login" className="login me-3">{t('landing_btn_login')}</Link>
        <Link to="/register" className="login me-3">{t('landing_btn_register')}</Link>

        <aside>
          <h3>You can choose one of these languages</h3>
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
        </aside>
      </main>
    </Container>
  );
}

export default Landing;
