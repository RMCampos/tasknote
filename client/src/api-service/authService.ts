import { API_TOKEN } from '../app-constants/app-constants';
import { SigninResponse } from '../types/SigninResponse';
import ApiConfig from './apiConfig';

/**
 * Sends a PUT request to the server to register a new user.
 *
 * @param {string} email - The user email to be registered.
 * @param {string} password - The user password to be registered.
 * @returns {Promise<SigninResponse>} A promise that resolves to SigninResponse if the request was
 * successful.
 * @throws {Error} An error object if there was an error
 */
async function registerUser(email: string, password: string): Promise<SigninResponse> {
  try {
    const response = await fetch(ApiConfig.registerUrl, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(API_TOKEN, data.token);
      return {
        token: data.token
      };
    }
    if (response.status === 409) {
      throw new Error('Email already exists!');
    }
  } catch (error) {
    if (typeof error === 'string') {
      throw new Error(error as string);
    } else if (error instanceof Error) {
      throw error;
    }
  }
  throw new Error('Unknown error');
}

/**
 * Sends a POST request to the server to authenticate a new user.
 *
 * @param {string} email - The user email to be authenticated.
 * @param {string} password - The user password to be authenticated.
 * @returns {Promise<SigninResponse>} A promise that resolves to SigninResponse if the request was
 * successful.
 * @throws {Error} An error object if there was an error
 */
async function authenticateUser(email: string, password: string): Promise<SigninResponse> {
  try {
    const response = await fetch(ApiConfig.signInUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(API_TOKEN, data.token);
      return {
        token: data.token
      };
    }

    if (response.status === 403) {
      throw new Error('Wrong username or password!');
    } else if (response.status === 404) {
      throw new Error('Username not found!');
    }
  } catch (error) {
    if (typeof error === 'string') {
      throw new Error(error as string);
    } else if (error instanceof Error) {
      throw error;
    }
  }
  throw new Error('Unknown error');
}

/**
 * Removes the token from local storage.
 */
function logoutUser(): void {
  localStorage.removeItem(API_TOKEN);
}

export {
  registerUser,
  authenticateUser,
  logoutUser
};
