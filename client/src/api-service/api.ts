import { API_TOKEN } from '../app-constants/app-constants';

/**
 * Retrieves the API token from local storage.
 *
 * @returns {string} The API token if it exists in local storage, otherwise an empty string.
 */
function getToken(): string {
  const tokenState = localStorage.getItem(API_TOKEN);
  return tokenState ?? '';
}

function getHeaders(): Headers {
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];

  return new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
    'X-XSRF-TOKEN': csrfToken || ''
  });
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
      credentials: 'include',
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

  postJSON: async (url: string, payload: object) => {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: getHeaders(),
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
      credentials: 'include',
      headers: getHeaders(),
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
      credentials: 'include',
      headers: getHeaders(),
    });
    if (response.status === 204) {
      return true;
    }
    handleError(response.status);
    return false;
  }
};

export default api;
