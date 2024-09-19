import { API_TOKEN } from '../app-constants/app-constants';
import { env } from '../env';
import { SigninResponse } from '../types/SigninResponse';

const server = env.VITE_BACKEND_SERVER;

/**
 *
 */
async function privateSessionState(signed: boolean): Promise<SigninResponse | undefined> {
  const tokenState = localStorage.getItem(API_TOKEN);

  if (signed && tokenState) {
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
  signinUrl: `${server}/auth/signin`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  signin: async (email: string, password: string): Promise<SigninResponse | undefined> => {
    try {
      const response = await fetch(ApiConfig.signinUrl, {
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
      } else {
        console.error('signin error', response);
      }
    }
    catch (error) {
      console.error(error);
    }
  },

  logoutFake: async (): Promise<void> => new Promise((resolve) => {
    resolve();
  }),

  currentSessionState: privateSessionState
};

export default ApiConfig;
