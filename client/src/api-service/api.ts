import { API_TOKEN } from '../app-constants/app-constants';
import { CsrfToken } from '../types/CsrfToken';

/**
 * Retrieves the API token from local storage.
 *
 * @returns {string} The API token if it exists in local storage, otherwise an empty string.
 */
function getToken(): string {
  const tokenState = localStorage.getItem(API_TOKEN);
  return tokenState ?? '';
}

function getHeaders(csrf?: CsrfToken): Headers {
  const headers: Headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${getToken()}`);
  if (csrf) {
    headers.append('X-CSRF-TOKEN', csrf.token);
  }
  return headers;
}

/**
 *
 */
function handleError(httpStatusCode: number) {
  if (httpStatusCode === 400) {
    throw new Error('Wrong or missing information!');
  }
  if (httpStatusCode === 403) {
    throw new Error('Forbidden! Access denied');
  }
  if (httpStatusCode === 500) {
    throw new Error('Internal Server Error!');
  }
  throw new Error('Unknown error');
}

const api = {
  getJSON: async (url: string) => {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    handleError(response.status);
    return false;
  },

  getCSRF: async (url: string) => {
    const csrfReq = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders()
    });
    if (csrfReq.ok) {
      const data = await csrfReq.json();
      return data;
    }
    handleError(csrfReq.status);
    return false;
  },

  postJSON: async (url: string, payload: object) => {
    let token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (!token) token = '';
    console.log("sending token", token);

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
        'X-CSRF-TOKEN': token
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    handleError(response.status);
    return false;
  },

  patchJSON: async (url: string, payload: object) => {
    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    handleError(response.status);
    return false;
  },

  deleteNoContent: async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    });
    if (response.status === 204) {
      return true;
    }
    handleError(response.status);
    return false;
  }
};

export default api;
