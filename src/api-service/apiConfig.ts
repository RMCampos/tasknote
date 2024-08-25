import { env } from "../env";
import { User } from "../types/User";

const server = env.VITE_BACKEND_SERVER;

const ApiConfig = {
  login: `${server}/login`,

  loginFake: async (): Promise<void> => {
    return new Promise((resolve) => {
      resolve();
    });
  },

  logoutFake: async (): Promise<void> => {
    return new Promise((resolve) => {
      resolve();
    });
  },

  currentSessionFake: async (signed: boolean): Promise<User | undefined> => {
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
  },
};

export default ApiConfig;
