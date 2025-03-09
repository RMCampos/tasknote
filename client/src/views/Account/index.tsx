import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FileText, Person } from 'react-bootstrap-icons';
import DOMPurify from 'dompurify';
import { clearStorage, setDefaultLang } from '../../storage-service/storage';
import AuthContext from '../../context/AuthContext';
import { LangAvailable, languages } from '../../constants/languages_available';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';
import FormInput from '../../components/FormInput';
import { translateServerResponse } from '../../utils/TranslatorUtils';
import { UserPatchRequest } from '../../types/UserPatchRequest';
import { UserResponse } from '../../types/UserResponse';
import ContentHeader from '../../components/ContentHeader';
import AlertError from '../../components/AlertError';
import './styles.css';

/**
 * Account page component.
 *
 * This component displays information about the user's account.
 *
 * @returns {React.ReactNode} The Account page component.
 */
function Account(): React.ReactNode {
  const { signOut, user, updateUser } = useContext(AuthContext);
  const { i18n, t } = useTranslation();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [userPasswordAgain, setUserPasswordAgain] = useState<string>('');

  /**
   * Handle the language change.
   *
   * @param {string} lang the language to change to.
   */
  const handleLanguage = (lang: string): void => {
    i18n.changeLanguage(lang);
    setDefaultLang(lang);
  };

  /**
   * Deletes the user account
   */
  const deleteAccount = async (): Promise<void> => {
    setShowAlert(false);
    await api.postJSON(ApiConfig.deleteAccountUrl, {});
    signOut();
    clearStorage();
  };

  /**
   * Handles errors by setting the error message and form invalid state.
   *
   * @param {unknown} e - The error to handle.
   */
  const handleError = (e: unknown): void => {
    if (typeof e === 'string') {
      setErrorMessage(translateServerResponse(e, i18n.language));
    }
    else if (e instanceof Error) {
      setErrorMessage(translateServerResponse(e.message, i18n.language));
    }
  };

  /**
   * Patches a user into.
   *
   * @param {UserPatchRequest} payload - The user data to patch.
   * @returns {Promise<boolean>} True if the task was added successfully, false otherwise.
   */
  const patchUserInfo = async (payload: UserPatchRequest): Promise<UserResponse | undefined> => {
    try {
      return await api.patchJSON(ApiConfig.userUrl, payload) as UserResponse;
    }
    catch (e) {
      handleError(e);
    }
  };

  /**
   * Resets the input fields to their default values.
   */
  const resetInputs = (userUpdated: UserResponse): void => {
    setUserName(userUpdated.name ? userUpdated.name : '');
    setUserEmail(userUpdated.email);
    updateUser(userUpdated);

    setValidated(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const form = event.currentTarget;

    const patchPayload: UserPatchRequest = {
      name: userName ? DOMPurify.sanitize(userName) : null,
      email: userEmail,
      password: userPassword,
      passwordAgain: userPasswordAgain
    };

    const updated: UserResponse | undefined = await patchUserInfo(patchPayload);
    if (updated) {
      form.reset();
      resetInputs(updated);
    }
  };

  useEffect(() => {}, [user]);

  return (
    <Container>
      <ContentHeader
        h1TextRegular="My"
        h1TextBold="Account"
        subtitle={t('account_my_account_hello')}
        h2BlackText="Update and Manage, Your"
        h2GreenText="Data"
      />

      <Row>
        <Col xs={6}>
          <div className="user-info-card">
            <div className="title">
              <Person />
              {' '}
              Change your info
            </div>
            <span className="description">
              Update only what you need. Blank fields will not be updated
            </span>

            <AlertError errorMessage={errorMessage} />

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
              {/* User name */}
              <FormInput
                labelText="First name"
                iconName="Person"
                required={false}
                name="name"
                placeholder={user?.name ? user.name : ''}
                value={userName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserName(e.target.value);
                }}
              />

              {/* User email */}
              <FormInput
                labelText="Email"
                iconName="At"
                required={false}
                name="email"
                placeholder={user?.email}
                value={userEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserEmail(e.target.value);
                }}
              />

              {/* User password */}
              <FormInput
                labelText="Password"
                iconName="Lock"
                required={false}
                type="password"
                name="password"
                value={userPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserPassword(e.target.value);
                }}
                data_testid="account-password-one"
              />

              {/* User password again */}
              <FormInput
                labelText="Repeat password"
                iconName="Lock"
                required={false}
                type="password"
                name="passwordAgain"
                value={userPasswordAgain}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserPasswordAgain(e.target.value);
                }}
              />

              <Button variant="primary" type="submit">
                Save profile information
              </Button>
            </Form>
            <hr />
            <p>
              If you want to display your picture, we support Gravatar.
              Please head to
              {' '}
              <a href="#">Gravatar</a>
              {' '}
              to register or update your profile picture.
            </p>
          </div>
        </Col>
        <Col xs={6}>
          <div className="user-info-card">
            <div className="title">
              <FileText />
              {' '}
              Change the app language
            </div>
            <span className="description">{t('account_app_lang_description')}</span>
            <div className="mt-4 mb-2">Available languages</div>
            <div>
              {languages.map((lang: LangAvailable) => (
                <Button
                  key={lang.key}
                  type="button"
                  variant="outline-primary"
                  className="btn-sm me-3"
                  onClick={() => handleLanguage(lang.lang)}
                  data-testid={`language-button-${lang.lang}`}
                >
                  {lang.lang === 'pt_br' && (
                    <span>🇧🇷 </span>
                  )}
                  {lang.lang === 'en' && (
                    <span>🇺🇸 </span>
                  )}
                  {lang.lang === 'es' && (
                    <span>🇪🇸 </span>
                  )}
                  {lang.lang === 'ru' && (
                    <span>🇷🇺 </span>
                  )}
                  {t(lang.key)}
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="my-4">
        <Col xs={12}>
          <h3 className="poppins-regular">Your Privacy</h3>
          <h4 className="poppins-bold home-productive">Matters</h4>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="user-info-card">
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
                <Alert.Heading>{t('account_delete_title')}</Alert.Heading>
                <p>{t('account_delete_description')}</p>
                <Button onClick={() => deleteAccount()} variant="outline-danger">
                  {t('account_delete_btn')}
                </Button>
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Account;
