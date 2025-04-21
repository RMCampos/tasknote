import React from 'react';
import { Alert } from 'react-bootstrap';

type Props = {
  errorMessage?: string;
  dataTestid?: string;
  onClose?: () => void;
};

/**
 * Renders an AlertError message banner.
 *
 * @param {Props} props the AlertError props with the message to be displayed.
 * @param {string} [props.errorMessage] Optional error message.
 * @param {string} [props.dataTestid] Optional data-testid property.
 * @param {Function} [props.onClose] OnClose function to be called.
 * @returns {React.ReactNode} the AlertError rendered component.
 */
const AlertError: React.FC<Props> = (props: Props): React.ReactNode => {
  if (!props.errorMessage || props.errorMessage.length === 0) {
    return null;
  }

  return (
    <Alert
      variant="danger"
      dismissible
      data-testid={props.dataTestid}
      onClose={props.onClose}
    >
      { props.errorMessage }
    </Alert>
  );
};

export default AlertError;
