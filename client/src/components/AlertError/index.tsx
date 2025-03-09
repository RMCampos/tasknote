import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

type Props = {
  errorMessage?: string;
  dataTestid?: string;
};

/**
 * Renders an AlertError message banner.
 *
 * @param {Props} props the AlertError props with the message to be displayed.
 * @param {string} [props.errorMessage] Optional error message.
 * @param {string} [props.dataTestid] Optional data-testid property.
 * @returns {React.ReactNode} the AlertError rendered component.
 */
const AlertError: React.FC<Props> = (props: Props): React.ReactNode => {
  return props.errorMessage && props.errorMessage.length > 0
    ? (
        <Row className="main-margin">
          <Col xs={12}>
            <Alert variant="danger" data-testid={props.dataTestid}>
              { props.errorMessage }
            </Alert>
          </Col>
        </Row>
      )
    : null;
};

export default AlertError;
