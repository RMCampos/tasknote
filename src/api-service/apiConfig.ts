import { env } from '../env';
import { User } from '../types/User';

const server = env.VITE_BACKEND_SERVER;

/**
 *
 */
function privateSessionFake(signed: boolean): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    if (signed) {
      resolve({
        name: 'User',
        email: 'email@domain.com'
      });
    } else {
      reject();
    }
  });
}

const ApiConfig = {
  login: `${server}/login`,

  loginFake: async (): Promise<void> => new Promise((resolve) => {
    resolve();
  }),

  logoutFake: async (): Promise<void> => new Promise((resolve) => {
    resolve();
  }),

  currentSessionFake: privateSessionFake
};

export default ApiConfig;
