import React from 'react';
import {
  Card, Col, Container, Row
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
    <Container className="my-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <Card className="p-4 shadow-sm border-radius-30">
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
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={8}>
          <Card className="p-4 shadow-sm border-radius-30 min-height-350">
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
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="p-4 shadow-sm border-radius-30 min-height-350">
            <h2 className="mb-4 poppins-bold about-title">{t('about_dev_title')}</h2>
            <p className="poppins-light">
              {t('about_dev_description')}
              <a href="mailto:ricardompcampos@gmail.com" className="text-decoration-none">
                ricardompcampos@gmail.com
              </a>
              {t('about_dev_description_two')}
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
