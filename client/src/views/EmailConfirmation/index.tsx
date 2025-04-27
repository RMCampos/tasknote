import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../../api-service/api';
import ApiConfig from '../../api-service/apiConfig';

type Status = 'loading' | 'success' | 'error';

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const confirmEmail = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('identification');
    if (!id) {
      setStatus('error');
      setErrorMessage('Wrong or missing identification.');
      return;
    }

    const payload = { identification: id };
    try {
      await api.postJSON(ApiConfig.confirmUrl, payload);
      setStatus('success');
    }
    catch (e) {
      setStatus('error');
      if (e instanceof Error) {
        setErrorMessage(e.message);
      }
      else {
        setErrorMessage(e as string);
      }
    }
  };

  useEffect(() => {
    confirmEmail();
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 px-3 text-center"
      style={{
        backgroundColor: '#E6F5E9',
        color: '#212529',
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
        rel="stylesheet"
      />

      <div className="p-4 bg-white rounded-3 shadow" style={{ maxWidth: '500px', width: '100%' }}>

        {status === 'loading' && (
          <>
            <div className="spinner-border text-success mb-3"></div>
            <p>Confirming your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="mb-3">✅ Email Confirmed</h1>

            <p className="mb-4">
              Thank you! Your email address has been successfully confirmed.
              You can now return to the TaskNote app and log in.
            </p>
            <Link to="/login" className="btn btn-success px-4 py-2"style={{ fontWeight: 'bold', borderRadius: '6px' }}>
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="mb-3">❌ Oops!</h1>
            <p className="mb-4">
              { errorMessage }
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default EmailConfirmation;
