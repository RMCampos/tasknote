import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
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
    <Container fluid>
      <ContentHeader
        h1TextRegular="About the"
        h1TextBold="TaskNote App"
        subtitle="Find more information about us and the app"
        h2BlackText="Tasks and notes made"
        h2GreenText="Easy"
      />

      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <Card className="p-4">
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <Card className="min-height-350 p-4">
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
        <Col sx={12} md={4} className="mt-4 mt-sm-0">
          <Card className="min-height-350 p-4">
            <Card.Body>
              <h2 className="mb-4 poppins-bold about-title">{t('about_dev_title')}</h2>
              <p className="poppins-light">
                {t('about_dev_description')}
                <a href="mailto:ricardompcampos@gmail.com" className="text-decoration-none">
                  ricardompcampos@gmail.com
                </a>
                {t('about_dev_description_two')}
              </p>
              <p className="poppins-light">
                You can also
                {' '}
                <a
                  href="https://buy-me-a-coffee-two-nu.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy me a coffee
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
