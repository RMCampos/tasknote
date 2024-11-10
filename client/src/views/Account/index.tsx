import React, { useContext, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FileText, Person, ShieldCheck } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { clearStorage, setDefaultLang } from '../../storage-service/storage';
import AuthContext from '../../context/AuthContext';
import { LangAvailable, languages } from '../../constants/languages_available';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

/**
 * Account page component.
 *
 * This component displays information about the user's account.
 *
 * @returns {JSX.Element} The Account page component.
 */
function Account(): JSX.Element {
  const { signOut, user } = useContext(AuthContext);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setDefaultLang(lang);
  };

  const deleteAccount = async (): Promise<void> => {
    setShowAlert(false);
    await api.postJSON(ApiConfig.deleteAccountUrl, {});
    signOut();
    clearStorage();
    navigate('/');
  };

  return (
    <Container className="about-page my-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4">
              <Person />
              {' '}
              {t('account_my_account_tittle')}
            </h2>
            <p>{t('account_my_account_hello')}</p>
            <p>
              {t('account_my_account_logged')}
              {' '}
              <b>
                {user?.email}
              </b>
            </p>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4">
              <FileText />
              {' '}
              {t('account_app_lang_tittle')}
            </h2>
            <p>{t('account_app_lang_description')}</p>
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
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="mb-4">
              <ShieldCheck />
              {' '}
              {t('account_privacy_little')}
            </h2>
            <p>{t('account_privacy_text')}</p>
            <Button
              variant="danger"
              type="button"
              onClick={() => setShowAlert(true)}
            >
              {t('account_privacy_delete_btn')}
            </Button>

            {showAlert && (
              <Alert className="mt-3" variant="danger" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>{t('account_delete_tittle')}</Alert.Heading>
                <p>{t('account_delete_description')}</p>
                <Button onClick={() => deleteAccount()} variant="outline-danger">
                  {t('account_delete_btn')}
                </Button>
              </Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
