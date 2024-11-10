import React from 'react';
import {
  Card, Col, Container, Row
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './style.scss';

/**
 * About page component.
 *
 * This component displays information about the application,
 * the technology used, and the developer.
 *
 * @returns {JSX.Element} The About page component.
 */
function About(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Container className="about-page my-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">{t('about_app_title')}</h2>
            <p>{t('about_app_description')}</p>
            <h4 className="mt-4">{t('about_app_features')}</h4>
            <ul>
              <li>{t('about_app_features_one')}</li>
              <li>{t('about_app_features_two')}</li>
              <li>{t('about_app_features_three')}</li>
            </ul>
            <h4 className="mt-4">{t('about_app_help_title')}</h4>
            <p>{t('about_app_help_description')}</p>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">{t('about_tech_title')}</h2>
            <p>{t('about_tech_description')}</p>
            <ul>
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
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4">{t('about_dev_title')}</h2>
            <p>
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
