import { env } from '../env';

const server = env.VITE_BACKEND_SERVER;

const ApiConfig = {

  signInUrl: `${server}/auth/sign-in`,

  registerUrl: `${server}/auth/sign-up`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  deleteAccountUrl: `${server}/rest/user-sessions/delete-account`,

  tasksUrl: `${server}/rest/tasks`,

  homeUrl: `${server}/rest/home`,

  notesUrl: `${server}/rest/notes`

};

export default ApiConfig;
