import React, { useContext, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { handleDefaultLang } from '../../lang-service/LangHandler';
import { setDefaultLang } from '../../storage-service/storage';
import { LangAvailable, languages } from '../../constants/languages_available';
import AuthContext from '../../context/AuthContext';
import './styles.scss';

/**
 * Landing page component.
 *
 * This component displays the landing page of the application,
 * providing navigation to login or register.
 * It also checks for an existing user session.
 *
 * @returns {React.ReactNode} The Landing page component.
 */
function Landing(): React.ReactNode {
  const { signed, checkCurrentAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
    setDefaultLang(lang);
  };

  useEffect(() => {
    checkCurrentAuthUser(window.location.pathname);
    handleDefaultLang();
    if (signed) {
      navigate('/home');
    }
  }, [signed]);

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center landing-page">
      <main>
        <h1 className="display-1">{t('landing_title')}</h1>
        <h2>{t('landing_subtitle')}</h2>

        <Link to="/login" className="login">{t('landing_btn_login')}</Link>
        <br />
        <Link to="/register" className="login">{t('landing_btn_register')}</Link>

        <aside>
          <h3>You can choose one of these languages</h3>
          {languages.map((lang: LangAvailable) => (
            <Button
              key={lang.key}
              type="button"
              variant="outline-primary"
              className="btn-sm me-3 mb-3"
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
