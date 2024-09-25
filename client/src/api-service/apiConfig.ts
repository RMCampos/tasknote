import { env } from '../env';

const server = env.VITE_BACKEND_SERVER;

const ApiConfig = {

  signInUrl: `${server}/auth/signin`,

  registerUrl: `${server}/auth/signup`,

  refreshTokenUrl: `${server}/rest/user-sessions/refresh`,

  tasksUrl: `${server}/rest/tasks`,

  homeUrl: `${server}/rest/home`,

  notesUrl: `${server}/rest/notes`

};

export default ApiConfig;
