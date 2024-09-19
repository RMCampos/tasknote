import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 *
 */
function NotFound() {
  const navigate = useNavigate();

  const goTo = useCallback((page: string) => {
    navigate(page);
  }, []);

  return (
    <>
      <h2>Not found!</h2>
      <Button
          type="button"
          variant="primary"
          onClick={() => goTo('/')}
        >
          Back to index
        </Button>
    </>
  );
}

export default NotFound;
