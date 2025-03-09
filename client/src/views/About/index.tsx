import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ContentHeader from '../../components/ContentHeader';

/**
 * About page component.
 *
 * This component displays information about the application,
 * the technology used, and the developer.
 *
 * @returns {React.ReactNode} The About page component.
 */
function About(): React.ReactNode {
  const { t } = useTranslation();

  return (
    <Container>
      <ContentHeader
        h1TextRegular="About the"
        h1TextBold="TaskNote App"
        subtitle="Find more information about us and the app"
        h2BlackText="Tasks and notes made"
        h2GreenText="Easy"
      />

      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <div className="user-info-card">
            <h2 className="mb-4 poppins-bold about-title">{t('about_app_title')}</h2>
            <p className="poppins-medium">{t('about_app_description')}</p>
            <h4 className="mt-4 poppins-medium">{t('about_app_features')}</h4>
            <ul className="poppins-light">
              <li>{t('about_app_features_one')}</li>
              <li>{t('about_app_features_two')}</li>
              <li>{t('about_app_features_three')}</li>
            </ul>
            <h4 className="mt-4 poppins-medium">{t('about_app_help_title')}</h4>
            <p className="poppins-light">{t('about_app_help_description')}</p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={8}>
          <div className="user-info-card min-height-350">
            <h2 className="mb-4 poppins-bold about-title">{t('about_tech_title')}</h2>
            <p className="poppins-light">{t('about_tech_description')}</p>
            <ul className="poppins-light">
              <li>{t('about_tech_list_one')}</li>
              <li>{t('about_tech_list_two')}</li>
              <li>{t('about_tech_list_three')}</li>
              <li>{t('about_tech_list_four')}</li>
              <li>{t('about_tech_list_five')}</li>
              <li>{t('about_tech_list_six')}</li>
              <li>{t('about_tech_list_seven')}</li>
            </ul>
          </div>
        </Col>
        <Col xs={4}>
          <div className="user-info-card min-height-350">
            <h2 className="mb-4 poppins-bold about-title">{t('about_dev_title')}</h2>
            <p className="poppins-light">
              {t('about_dev_description')}
              <a href="mailto:ricardompcampos@gmail.com" className="text-decoration-none">
                ricardompcampos@gmail.com
              </a>
              {t('about_dev_description_two')}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
