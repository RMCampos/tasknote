import { API_TOKEN } from '../app-constants/app-constants';
import { env } from '../env';
import { SigninResponse } from '../types/SigninResponse';

const server = env.VITE_BACKEND_SERVER;

/**
 *
 */
async function privateSessionState(): Promise<SigninResponse | undefined> {
  const tokenState = localStorage.getItem(API_TOKEN);

  if (tokenState) {
    const response = await fetch(ApiConfig.refreshTokenUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenState}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(API_TOKEN, data.token);
      return {
        token: data.token
      };
    } else {
      console.error(response);
    }
  }
  return Promise.reject();
}

const ApiConfig = {
  signInUrl: `${server}/auth/signin`,

  registerUrl: `${server}/auth/signup`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  tasksUrl: `${server}/rest/tasks`,

  homeUrl: `${server}/rest/home`,

  notesUrl: `${server}/rest/notes`,

  login: async (email: string, password: string): Promise<SigninResponse | Error> => {
    try {
      const response = await fetch(ApiConfig.signInUrl, {
        method: 'POST',
        mode: 'cors',
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
        return new Error('Wrong username or password!');
      }
      if (response.status === 404) {
        return new Error('Username not found!');
      }
    }
    catch (error) {
      if (typeof error === 'string') {
        return new Error(error as string);
      }
    }
    return new Error('Unknown error');
  },

  register: async (email: string, password: string): Promise<SigninResponse | Error> => {
    try {
      const response = await fetch(ApiConfig.registerUrl, {
        method: 'PUT',
        mode: 'cors',
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
        return new Error('Email already exists!');
      }
    }
    catch (error) {
      if (typeof error === 'string') {
        return new Error(error as string);
      }
    }
    return new Error('Unknown error');
  },

  logout: (): void => {
    localStorage.removeItem(API_TOKEN);
  },

  currentSessionState: privateSessionState
};

export default ApiConfig;
